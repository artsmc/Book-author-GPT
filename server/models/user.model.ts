import { mongoSetup } from '../_config/config';
import { IUsers } from '../interfaces/user.interface';
import { userSchema } from '../schemas/user.schema';
import * as mongoose from 'mongoose';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const UserModel: mongoose.Model<IUsers> = mongoose.model<IUsers>(
  'Users',
  userSchema,
);
