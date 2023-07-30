import { mongoSetup } from '../_config/config';
import { IRoles } from '../interfaces/roles.interface';
import { rolesSchema } from '../schemas/roles.schema';
import * as mongoose from 'mongoose';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const RoleModel: mongoose.Model<IRoles> = mongoose.model<IRoles>(
  'Roles',
  rolesSchema,
);
