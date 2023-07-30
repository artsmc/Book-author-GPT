import { Document } from 'mongoose';

export interface IUsers extends Document {
  _id?: string;
  email: string;
  agent: string;
  token?: string;
  company: string;
  user_id: string;
  ip: string;
  user_agent: string;
  referrer: string;
  full_name: string;
  password: string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
}

