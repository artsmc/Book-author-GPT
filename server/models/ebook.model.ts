import * as mongoose from 'mongoose';
import { mongoSetup } from '../_config/config';
import { IEbook } from '../interfaces/ebook.interface';
import { ebookSchema } from '../schemas/ebook.schema';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const EbookModel: mongoose.Model<IEbook> = mongoose.model<IEbook>(
  'Ebooks',
  ebookSchema,
);
