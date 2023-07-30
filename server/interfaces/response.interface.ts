import { Document } from 'mongoose';

export interface IResponse extends Document {
  _id?: string;
  tone:string;
  emojiAllowed:string;
  characterLimit: number;
  customerInquery: string;
  responseCreated: string;
  feelingsAllowed: boolean;
  responseFinalized: string;
  agentContext: string;
  user: string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
}