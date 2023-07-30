    import { UtilService } from './util.service';
  import { convert } from 'html-to-text';
  import * as path from 'path';
  import EPub = require("epub");
  import * as wordcount from 'wordcount';
  import { EbookModel } from '../models/ebook.model';
  import prettyMilliseconds from 'pretty-ms';
  import { pineconeService } from './pinecode.service';
  import { IEbook } from '../interfaces/ebook.interface';
  import { v4 as uuidv4 } from 'uuid';
  const options = {
  wordwrap: 130,
  // ...
  };
  class EpubParserService extends UtilService {
    constructor() {
        super();
    }
    //const state = new AudioModel({
    public async storeBook(file: string) {
      const eBook = path.join('./', `/uploads/${file}`);
      const epub = new EPub(eBook);
      const id = uuidv4();
      const state = await this.parseEpub(epub, id);
      return this.saveState(state);
    }
    
    private parseEpub(epub: any, id: string) {
      return new Promise<IEbook>(async (resolve, reject) => {
        const size = 4000;
        epub.on("end", async () => {
          const state = new EbookModel(epub.metadata);
          state.UUID = epub.metadata['UUID'] || id;
          state.sections = [];
          state.vectorIds = [];
    
          for (const chapter of epub.flow) {
            try {
              const text = await this.getChapter(epub, chapter.id);
              const block = JSON.stringify(convert(text, options).replace(/\n/g, ""));
              const sectionData = await this.processSection(chapter, block, id, size);
              state.sections.push(sectionData.section);
              state.vectorIds.push(...sectionData.vectorIds);
            } catch (err) {
              reject(err);
            }
          }
    
          resolve(state);
        });
    
        epub.parse();
      });
    }
    
    private getChapter(epub: any, chapterId: string) {
      return new Promise<string>((resolve, reject) => {
        epub.getChapter(chapterId, (err, text) => {
          if (err) { reject(err); }
          resolve(text);
        });
      });
    }
    
    private async processSection(chapter: any, block: string, id: string, size: number) {
      const vectorIds = [];
      const splitSumm = this.splitFlatText(size, block).splitStringMap;
    
      for (const [idx, sectSumm] of splitSumm.entries()) {
        if (sectSumm) {
          const thisResult = (await pineconeService.insertBook(id, sectSumm.text, idx, size, chapter.id))['id'];
          vectorIds.push(thisResult);
        }
      }
    
      const section = {
        name: chapter.id,
        text: block,
        sectionStats: this.calculateSectionStats(block, size),
      };
    
      return { section, vectorIds };
    }
    
    private calculateSectionStats(block: string, size: number) {
      const characterCount = block.length;
      const wordCount = wordcount(block);
      const readingTimeMS = wordCount * 60000 / 238;
      const vectorSize = Math.floor(characterCount / size) > 1 ? Math.floor(characterCount / size) : 1;
    
      return {
        characterCount,
        wordCount,
        readingTimeText: prettyMilliseconds(readingTimeMS),
        readingTimeMinutes: wordCount / 238,
        readingTimeMS,
        vectorSize,
        vectorQuerySize: size
      };
    }
    
    private async saveState(state: IEbook): Promise<IEbook> {
      try {
        const collection = await state.save();
        return collection.toObject();
      } catch (stateErr) {
        console.log(stateErr);
        throw stateErr;
      }
    }
    
    public getBook(id: string):Promise<IEbook> {
      return EbookModel.findOne({_id: id});
    }
    
    public deleteBook(ids:string[], id: string): Promise<any> {
      return pineconeService.delete(ids, id);
    }
    
    public deleteBookIndex(id: string): Promise<any> {
      return pineconeService.deleteIndex(id);
    }
    
    public async summarizeVectors(id, vectors): Promise<any> {
      try {
        const book = await EbookModel.findOne({
          UUID: id,
          is_active: true
        });
        return this.readFromVector(id, book, vectors);
      } catch(err) {
        console.log(err);
        throw { err };
      }
    }
    private async readFromVector(id, result, vectors): Promise<any> {
      const filterFrom:{index: number, chapter: string}[] = vectors.map((vector) => {
        return {index: vector.metadata.index, chapter: vector.metadata.chapter};
      });
      const filteredContent = result.sections.filter((item) => filterFrom.map(e => e.chapter).includes(item.name))
      .filter(Boolean).map((item) => {
        return this.splitFlatText(result.vectorQuerySize, item.text).splitStringMap.map((sectTextSplit, idx) => {
          if(filterFrom.map(e => e.index).includes(idx)) {
            return sectTextSplit.text;
          }
        }).filter(Boolean)[0];
      });
      return filteredContent;
    }
    
  }

  export const epubParserService = new EpubParserService();
