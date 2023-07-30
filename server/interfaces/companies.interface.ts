import { Document } from 'mongoose';

export interface ICompanies extends Document {
  _id?: string;
  name:string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
}

