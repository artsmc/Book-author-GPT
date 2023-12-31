import { UtilController } from './util.controller';
import { epubParserService } from '../services/epubparser.service';
import { EbookModel } from '../models/ebook.model';
import { openAIService } from '../services/openai.service';
import { melvilleGPTController } from './melvilleGPT.controller';

class EBooksController extends UtilController {
    constructor() {
        super();
    }

    async storeEBook(file, namespace) {
        return await epubParserService.storeBook(file, namespace);
    }

    async getEBook(id) {
        return await epubParserService.getBook(id);
    }

    async getEBookList() {
        return await EbookModel.find({},'_id title author UUID ebookStats');
    }

    async searchBooks(id, query): Promise<string> {
        const book = await epubParserService.getBook(id);
        console.log(id, query, book);
        return await melvilleGPTController.searchBook(book.UUID, query, book);
    }
    async searchBooksbyNamespace(id, query): Promise<string> {
        console.log(id, query);
        return await melvilleGPTController.searchNamespace(id, query);
    }
    async returnMessage(id: string, message: string, body) {
        try {
            const step = await this.searchBooks(id, message);
            console.log(body);
            return await openAIService.BuildGPTBookResponse(message, step, {model:'gpt-3.5-turbo-16k'});
        } catch (error){
            console.log({error});
            throw error;
        }
    }

    async deleteBook(id) {
        const book = await EbookModel.findOne({_id:id});
        await epubParserService.deleteBook(book.vectorIds, book.UUID);
        return await EbookModel.findOneAndDelete({_id:id});
    }

    async deleteBookIndex(id) {
        return await epubParserService.deleteBookIndex(id);
    }
}

export const eBooksController = new EBooksController();