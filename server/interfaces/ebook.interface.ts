import { Document } from 'mongoose';

export interface IEbook extends Document {
  _id: string;
  language: string,
  UUID: string,
  title: string,
  coverImage: string;
  creator: string,
  vectorIds: string[];
  vectorSize?: number;
  vectorQuerySize?: number;
  ebookStats: {
    sections: number,
    characterCount: number,
    wordCount: number,
    readingTimeText?:  string,
    readingTimeMS: number,
  };
  sections: {
    _id?: string;
    name: string;
    sectionStats: {
      characterCount: number,
      wordCount: number,
      readingTimeText:  string,
      readingTimeMinutes: number,
      readingTimeMS: number,
      vectorSize?: number;
      vectorQuerySize?: number;
    }
    text: string;
  }[];
  is_active?: boolean;
  is_system?: boolean;
  created_at?: string;
  modified_at?: string;
}

