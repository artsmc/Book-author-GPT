import * as Joi from 'joi';

import { Schema } from 'mongoose';

export let companiesSchema: Schema = new Schema(
  {
    name: { type: String, index: true, unique: true, required: true },
    is_active: { type: Boolean },
    is_system: { type: Boolean },
    created_at: Date,
    modified_at: Date,
  },
  {
    versionKey: false,
    strict: true,
    collection: 'companies',
  },
);

companiesSchema.pre<any>('validate', function (next) {
  if (!this.created_at) {
    this.created_at = new Date().toISOString();
  }
  if (!this.is_active) {
    this.is_active = true;
  }
  if (!this.is_system) {
    this.is_system = false;
  }
  next();
});
