import {
    UtilController
} from './util.controller';
import { pineconeService } from '../services/pinecode.service';
import { transcriptController } from './transcript.controller';
import { openAIService } from '../services/openai.service';
import { epubParserService } from '../services/epubparser.service';
import { IEbook } from '../interfaces/ebook.interface';
import { EBookRouter } from './../routes/ebook.routes';
import { EbookModel } from '../models/ebook.model';

class MelvilleGPTController extends UtilController {
    constructor() {
        super();
    }
    searchBook(id:string, query: string, book:IEbook): Promise<string> {
        return new Promise((resolve, reject) => {
            const searchLimit = Math.floor((4096-500)*4/book.vectorQuerySize*2)<=45?Math.floor((4096-500)*4/book.vectorQuerySize*2):44;
            pineconeService.query(id, query, searchLimit).then(step => {
            epubParserService.summarizeVectors(id, step).then(ready => {
                resolve(ready.join(' '));
            }).catch(error => {
                reject({ error });
            });
            }).catch(error => {
                reject(error);
            });
        });
    }
    searchNamespace(id:string, query: string): Promise<string> {
        return new Promise((resolve, reject) => {
            pineconeService.query(id, query, 20).then(step => {
            // convert steps into transcripts by grabbing the transcript id from the step.metadata.transcript in the step array
            // then find the transcript in the database and return the transcript TranscriptModel
            const books = step.map(async (book) => {
                const result = await EbookModel.findOne({
                UUID: book.metadata.book,
                is_active: true
                });
                // filter book.metadata.name === result.sections
                const splitBook = result.sections.find((item) => item.name === book.metadata.chapter);
                
                if (splitBook) {
                    return this.splitFlatTextClean(splitBook.sectionStats.vectorQuerySize, splitBook.text).splitStringMap[book.metadata.index];
                }
                
                // Handle the case when splitBook is falsy (could throw an error or return a default value)
               
            });
            Promise.all(books).then(ready => {
                resolve(ready.map(t=>t.text).join(' '));
            }).catch(error => {
                reject({ error });
            });
            }).catch(error => {
                reject(error);
            });
        });
    }
    returnBookMessage(id: string, message: string, transcript:IEbook) {
        return new Promise((resolve, reject) => {
            this.searchBook(id, message, transcript).then(step => {
                openAIService.BuildGPTBookResponse(message, step, {model:'gpt-3.5-turbo-16k'}).then(ready => {
                    resolve(ready);
                }).catch(error => {
                    console.log({error});
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
    async returnContextMessage( message: string, context: string) {
        try {
            const ready = await openAIService.BuildGPTResponse(message, context, { model: 'gpt-3.5-turbo-16k' });
            return ready;
        } catch (error) {
            console.log({ error });
            throw error;
        }
    }
}
export const melvilleGPTController = new MelvilleGPTController();
