import { openAIService } from '../services/openai.service';
import { eBooksController } from './ebooks.controller';
import { transcriptController } from './transcript.controller';
import { UtilController } from './util.controller';

class AskGaryController extends UtilController {
  public async searchInquery(query: string) {
      try {
          const audioSearch = await transcriptController.searchTranscripts('garyvee', query);
          const bookSearch = await eBooksController.searchBooksbyNamespace('garyveebooks', query);
          return {audioSearch, bookSearch};
      } catch (error) {
          console.error(error);
          throw error; // Rethrow the error so it can be handled by the calling function.
      }
  }
  async returnMessage(query: string) {
        try {
            const context = await this.searchInquery(query);
            // @ts-ignore
            return await openAIService.BuildGPTAskGaryResponse(query, context, {model:'gpt-3.5-turbo-16k'});
        } catch (error){
            console.log({error});
            throw error;
        }
    }
}

export const askGaryController = new AskGaryController();
