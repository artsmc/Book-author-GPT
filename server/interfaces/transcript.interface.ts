import { Document } from 'mongoose';

export interface ITranscript extends Document {
  _id: string;
  audio: string;
  podcast: string;
  user: string;
  status: string;
  key: string;
  aiKey: string;
  jobName: string;
  namespace: string;
  transcriptStats: {
    tokens?: number;
    summaryTokens?: number;
    wordCount?: number;
    trimmedCount?: number;
  };
  trimmedTranscript: string;
  topic: string;
  headlineOptions: [{ _id?: string, text: string; }];
  fullTranscript: string;
  speakerCount?: number| string;
  noStopWord: string;
  sentenceSplit: string[];
  sentenceSplitNoStop: string[];
  vectorId: string[];
  vectorSize?: number;
  vectorQuerySize?: number;
  start_at: number;
  dictionary: Array<{ order: number; confidence: number; start_time: number; end_time: number; }>;
  word2Vec: [number[]];
  speakerSort?: ISpeakerSort[] | [];
  is_active?: boolean;
  is_system?: boolean;
  created_at?: string;
  modified_at?: string;
}
export interface ISpeakerSort extends Document {
  start_time: number;
  end_time: number;
  speaker_label: string;
  _id?: string;
  wordsSplit?: string[];
  dictionary?: Array<{ order?: number; confidence: number; start_time: number; end_time: number; }>;
  confidenceSplit?: string[];
  sentenceSplit?: string[];
  transcript: string;
  noStopWord?: string;
  audioQuality?: {
    low: string;
    avg: string;
    high: string;
  };
}

export interface ISplitLines {
  count: number;
  splitStringMap: IStringMap[];
}

interface IStringMap {
  text: string;
  locationStart: number;
}
