import { Document } from 'mongoose';

export interface IRoles extends Document {
  _id?: string;
  name:string;
  clean:string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
}

