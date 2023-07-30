import { mongoSetup } from '../_config/config';
import { IResponse } from '../interfaces/response.interface';
import { responseSchema } from '../schemas/response.schema';
import * as mongoose from 'mongoose';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const ResponseModel: mongoose.Model<IResponse> = mongoose.model<IResponse>(
  'Responses',
  responseSchema,
);
