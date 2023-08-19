import { IOpenAICompletion, IOpenAICompletionDefault } from './../interfaces/openai.interface';
import { UtilService } from './util.service';
import axios from 'axios';

const assembly = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: process.env.ASSEMBLY_AI,
    'content-type': 'application/json',
  },
});
const assemblyUpload = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: process.env.ASSEMBLY_AI,
    'Transfer-Encoding' : "chunked"
  },
});
const url = 'https://api.assemblyai.com/v2/upload';
import * as fs from 'fs';
import fetch from 'node-fetch';

class AssemblyAIService extends UtilService {
    public async UploadTranscript(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                const params = {
                    headers: {
                        "authorization": process.env.ASSEMBLY_AI,
                        "Transfer-Encoding": "chunked"
                    },
                    body: data,
                    method: 'POST'
                };
                fetch(url, params)
                .then(response => response.json())
                .then(data => {
                    console.log(`URL: ${data['upload_url']}`)
                    resolve(data['upload_url']);
                })
                .catch((error) => {
                    reject(error);
                    console.error(`Error: ${error}`);
                });
            });
        });
    }
    public async TranscribeAudio(audioURL: string, multiple: boolean, speakerCount:number): Promise<any> {
        const dataObject = {
            audio_url: audioURL,
            speaker_labels: speakerCount > 0 ? multiple : true,
            speakers_expected: speakerCount > 0 ? Number(speakerCount) : undefined,
            auto_chapters: true,
            punctuate: true,
            format_text: true,
            sentiment_analysis: true,
            disfluencies: true,
        };
        try {
            const res = await assembly.post(`/transcript`, dataObject);
            console.log(`Recieved a transcript: ${audioURL}\n ${res.data.id}`);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async Transcript(transcriptID: string): Promise<any> {
        try {
            const res = await assembly.get(`/transcript/${transcriptID}`);
            const utterances = res.data.utterances || {};
            const words = res.data.words || [];

            const transcript = {
                status: res.data.status,
                text: res.data.text,
                id: res.data.id,
                trimmedTranscript: this.AssemblyChapterSumary(res.data.chapters),
                headlineOptions: this.AssemblyChapterHeadlines(res.data.chapters),
                utterances: words.length ? utterances : {
                    '0': {
                        ...res.data,
                        speaker: 'A',
                        start: words.length ? words[0].start : null,
                        end: words.length ? words[words.length - 1].end : null
                    }
                }
            };
            return transcript;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private AssemblyChapterSumary(chapters): string {
        return chapters?.map(chapter => chapter.summary).join('') || '';
    }

    private AssemblyChapterHeadlines(chapters): string[] {
        return chapters?.map(chapter => chapter.headline) || [];
    }
}

export const assemblyAIService = new AssemblyAIService();