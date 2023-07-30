
import { PineconeClient } from '@pinecone-database/pinecone';
import * as _ from 'lodash';
const options = {
  minPoolSize: 2,
  useNewUrlParser: "true",
  useUnifiedTopology: "true"
};
export const MONGODB_CONNECTION = process.env.MONGO_DEV;
export const mongoSetup = {
  options,
  MONGODB_CONNECTION
};
// tslint:disable-next-line:no-shadowed-variable
export const awsOpts = {
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
};
export const jwtSecret = process.env.MAGIC_LINK_SECRET;


export const pinecone = new PineconeClient();
