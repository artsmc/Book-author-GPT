import {
    UtilController
} from './util.controller';
import { pineconeService } from '../services/pinecode.service';
import { transcriptController } from './transcript.controller';
import { openAIService } from '../services/openai.service';
import { epubParserService } from '../services/epubparser.service';
import { IEbook } from '../interfaces/ebook.interface';

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
    returnBookMessage(id: string, message: string, transcript:IEbook) {
        return new Promise((resolve, reject) => {
            this.searchBook(id, message, transcript).then(step => {
                openAIService.BuildGPTBookResponse(message, step, {model:'gpt-3.5-turbo'}).then(ready => {
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


}
export const melvilleGPTController = new MelvilleGPTController();
