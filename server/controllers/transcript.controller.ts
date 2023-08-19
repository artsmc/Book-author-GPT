import { TranscriptModel } from '../models/transcripts.model';
import { openAIService } from '../services/openai.service';
import { pineconeService } from '../services/pinecode.service';
import {
  assemblyAIService
} from './../services/assemblyai.service';
import {
  UtilController
} from './util.controller';
import * as sent from 'sbd';
import * as path from 'path';
import * as wordcount from 'wordcount';
import { melvilleGPTController } from './melvilleGPT.controller';
import { IAssemblyTranscriptUtterances } from '../interfaces/assembly.interface';
import { ISpeakerSort } from '../interfaces/transcript.interface';

class TranscriptController extends UtilController {
  lastResult = {};
  async storeTranscript(file: any, namespace: string) {
    try {
            const storage = await assemblyAIService.UploadTranscript(path.join('./', `/uploads/${file}`));
            const transcript = await assemblyAIService.TranscribeAudio(storage, true, 0);
            const state = new TranscriptModel({
              aiKey: transcript.id,
              audio: transcript.audio_url,
              language: transcript.language_code,
              status: transcript.status,
              namespace,
              sentiment_analysis: transcript.sentiment_analysis_result
            });
            state.save().then((data) => {
              return data;
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
  }
  async remapTranscript(body) {
    try {
      const status = await assemblyAIService.Transcript(body.transcript.aiKey);
      const complete = await this.addSpeakerContent({
        ...{
          content: body
        },
        ...status
      });
      return complete;
    } catch (err) {
      throw err;
    }
  }
  remapTranscriptTrim(body) {
      return new Promise(async (resolve, reject) => {
          const directTranscript = this.buildFlatTranscript(body.transcript.speakerSort, body.transcript.start_at);
          const trimmedTranscript = await this.generateTrimmed(body.transcript._id, this.splitFlatText(4000, directTranscript), body.transcript.key, 'gpt-3.5-turbo');
          try {
              const updatedTranscript = await TranscriptModel.findByIdAndUpdate(
                  body.transcript._id,
                  {
                      transcriptStats: {
                          tokens: Math.floor(body.transcript.fullTranscript.length) / 4,
                          wordCount: wordcount(body.transcript.fullTranscript),
                          trimmedCount: wordcount(trimmedTranscript)
                      },
                      trimmedTranscript
                  },
                  {
                      new: true,
                      useFindAndModify: false
                  }
              );
  
              await this.insertVectorIndex(body.transcript._id);
  
              resolve(updatedTranscript);
          } catch (error) {
              console.error(error);
              reject(error);
          }
      });
  }
  async addSpeakerContent(body): Promise<string> {
    console.log(body.status)
    console.log('addSpeakerContent');
    return new Promise(async (resolve, reject) => {
      const utterances: IAssemblyTranscriptUtterances = body.utterances || {};
      const speakerSort = Object.keys(utterances).map((num, i: number) => {
        if (utterances) {
          return {
            status: body.status,
            start_time: utterances[num].start,
            end_time: utterances[num].end,
            speaker_label: this.returnNato(utterances[num].speaker),
            transcript: utterances[num].text,
            sentenceSplit: sent.sentences(utterances[num].text, {}),
            dictionary: utterances[num].words.map((word, idx) => {
              return {
                order: idx,
                confidence: word.confidence,
                word: word.text,
                start_time: word.start,
                end_time: word.end
              };
            })
          };
        }
        return;
      }).filter(values => !!values);
      const startedAt = body.content.transcript.start_at || 0;
      const directTranscript = this.buildFlatTranscript(speakerSort, startedAt);
      const trimmedTranscript = await this.generateTrimmed(body.content.transcript._id, this.splitFlatText(2600, directTranscript), body.content.transcript.key, 'gpt-3.5-turbo-16k');
      const topic = await melvilleGPTController.returnContextMessage(`What's the Topic?`, trimmedTranscript);
      TranscriptModel.updateOne({
        _id: body.content.transcript._id
      }, {
        aiKey: body.id,
        speakerSort,
        status: 'COMPLETED',
        transcriptStats: {
          tokens: Math.floor(wordcount(body.text) / 750) * 1000,
          wordCount: wordcount(body.text),
          trimmedCount: wordcount(trimmedTranscript)
        },
        fullTranscript: body.text,
        trimmedTranscript,
        topic:topic.choices[0].message.content,
        headlineOptions: body.headlineOptions,
        sentenceSplit: sent.sentences(body.text, {}),
      }, {
        new: true,
        useFindAndModify: false
      }).then((complete) => {
        console.log('update transcript: addSpeakerContent');
        this.insertVectorIndex(body.content.transcript._id).then(indexed => {
          console.log('REMAP COMPLETE: addSpeakerContent');
          resolve(body.content.transcript._id);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
      }).catch(error => {
       console.log(error);
        reject(error);
      })
    });
  }
  async generateTrimmed(id: string, flatTranscript, key: string, quality: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.lastResult[id] = '';
      const finalTrimmed = flatTranscript.splitStringMap.map(async (sectTrim) => {
        const thisResult = (await openAIService.BuildTrimmedTranscript(sectTrim.text, key, {
          max_tokens: Math.floor(8000 / flatTranscript.count) + 10,
          top_p: 1
        }, this.lastResult[id], quality)).choices[0].message.content;
        this.lastResult[id] = thisResult;
        return thisResult.replace(/\n/g, '');
      });
      Promise.all(finalTrimmed).then(async (readySum) => {
        delete this.lastResult[id];
        resolve(readySum.join(' ').replace(/\n/g, ''));
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }
  async findUniqueSpeakers(body): Promise<ISpeakerSort[]> {
      return this.findUniqueSpeaker(body.transcript.speakerSort);
  }
  async updateAllSpeakersWith(body): Promise<any> {
    try {
      const updatedSpeakers = this.renameAllSpeaker(body.transcript.speakerSort, body.id, body.speakerChange);
      const complete = await TranscriptModel.updateOne(
        { _id: body.transcript._id },
        { speakerSort: updatedSpeakers },
        { new: true, useFindAndModify: false }
      );
      return complete;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  searchTranscripts(id:string, query: string): Promise<string> {
      return new Promise((resolve, reject) => {
          pineconeService.query(id, query, 9).then(step => {
            // convert steps into transcripts by grabbing the transcript id from the step.metadata.transcript in the step array
            // then find the transcript in the database and return the transcript TranscriptModel
            const transcripts = step.map(async (transcript) => {
              const result = await TranscriptModel.findOne({
                _id: transcript.metadata.transcript,
                is_active: true
              });
              return this.flattenTranscriptAt(result.speakerSort, result.start_at, result.vectorSize).filter((item, idx) => idx === transcript.metadata.index)[0];
            });
            Promise.all(transcripts).then(ready => {
              resolve(ready.join(' '));
            }).catch(error => {
              reject({ error });
            });
          }).catch(error => {
              reject(error);
          });
      });
  }
  private renameAllSpeaker(split, id: string, change: string): ISpeakerSort[] {
    const speakerOrgin = split.find(speaker => speaker._id.toString() === id).speaker_label;
  
    return split.map(speaker => {
      if (speaker.speaker_label === speakerOrgin) {
        speaker.speaker_label = change;
      }
      return speaker;
    });
  }
  insertVectorIndex(id): Promise<any> {
    return new Promise((resolve, reject) => {
      TranscriptModel.findOne({
        _id: id,
        is_active: true
      }).then((result) => {
        if (result.vectorId && result.vectorId.length > 0) {
          pineconeService.delete(result.vectorId, result._id.toString()).then(ready => {
            this.runVector(id, result, 4000)
              .then(ready => resolve(ready))
              .catch(err => {
                console.log(err);
                reject(err);
              });
          }).catch(err => {
            console.log(err);
            reject(err);
          });
        } else {
          this.runVector(id, result, 4000)
            .then(ready => resolve(ready))
            .catch(err => {
              console.log(err);
              reject(err);
            });
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
  private runVector(id, result, size) {
    return new Promise(async (resolve, reject) => {
      const flatTranscript = this.flattenTranscriptAt(result.speakerSort, result.start_at, size);
      const splitSumm = flatTranscript.map(async (sectSumm, idx) => {
        if (sectSumm) {
          const thisResult = (await pineconeService.insert(result.namespace, id, sectSumm, idx, size))['id'];
          return thisResult;
        }
      });
      Promise.all(splitSumm).then(promisedPrepared => {
        if (promisedPrepared && promisedPrepared.length > 0) {
          const vectors = promisedPrepared.filter(el => el);
          TranscriptModel.findOneAndUpdate({
            _id: id
          }, {
            vectorId: vectors,
            vectorSize: size,
            vectorQuerySize:flatTranscript.length
          }, {
            new: true,
            useFindAndModify: false
          }).then( (result) => {
            resolve({});
          }).catch(err => {
            console.log(err);
          });
        } else {
          console.log({ err: 'openAI did not return data' });
          reject({ err: 'openAI did not return data' });
        }
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }
  private readFromVector(id, result, vectors) {
    return new Promise(async (resolve, reject) => {
      const filterFrom = vectors.map((vector) => vector.metadata.index);
      const flatTranscript = this.flattenTranscriptAt(result.speakerSort, result.start_at, result.vectorSize);
      const splitSumm = flatTranscript.filter((item,idx) => filterFrom.includes(idx));
      resolve(splitSumm);
    });
  }
  private convertToSeconds(time) {
    return time.replace('[', '').replace(']', '').split(':').reduce((acc, time) => (60 * acc) + +time);
  }
  private findUniqueSpeaker(split: any[]): ISpeakerSort[] {
      let speakerIndex = [];
      let speakerStatement = split.filter(speaker => {
          if (!speakerIndex.includes(speaker.speaker_label)) {
              speakerIndex.push(speaker.speaker_label);
              return true;
          }
          return false;
      });
      return speakerStatement;
  }

  
}

export const transcriptController = new TranscriptController();
