import { mongoSetup } from '../_config/config';
import { ICompanies } from '../interfaces/companies.interface';
import { companiesSchema } from '../schemas/companies.schema';
import * as mongoose from 'mongoose';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const CompanyModel: mongoose.Model<ICompanies> = mongoose.model<ICompanies>(
  'Companies',
  companiesSchema,
);
