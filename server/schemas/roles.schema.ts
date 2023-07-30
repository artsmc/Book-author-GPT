import * as Joi from 'joi';

import { Schema } from 'mongoose';

export let rolesSchema: Schema = new Schema(
  {
    name: { type: String, index: true, unique: true, required: true },
    clean: { type: String, lowercase: true},
    is_active: { type: Boolean },
    is_system: { type: Boolean },
    created_at: Date,
    modified_at: Date,
  },
  {
    versionKey: false,
    strict: true,
    collection: 'roles',
  },
);

rolesSchema.pre<any>('validate', function (next) {
  if (!this.created_at) {
    this.created_at = new Date().toISOString();
  }
  if (!this.is_active) {
    this.is_active = true;
  }
  if (!this.clean) {
    //turn the name into a clean string and convert spaces into dashes
    this.clean = this.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
  }
  if (!this.is_system) {
    this.is_system = false;
  }
  next();
});
