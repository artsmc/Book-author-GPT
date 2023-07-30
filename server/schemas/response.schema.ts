import * as Joi from 'joi';

import { Schema } from 'mongoose';

export let responseSchema: Schema = new Schema(
  {
    tone:{ type: String, default: 'formal' },
    emojiAllowed:{ type: String, default:'🫡😔☹️🧐🤓😊🤔💖' },
    feelingsAllowed: { type: Boolean, default: true},
    characterLimit: { type: Number, default: 300},
    customerInquery: { type: String, required: true},
    responseCreated:{ type: String },
    responseFinalized: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    is_active: { type: Boolean },
    is_system: { type: Boolean },
    created_at: Date,
    modified_at: Date,
  },
  {
    versionKey: false,
    strict: true,
    collection: 'responses',
  },
);

responseSchema.pre<any>('validate', function (next) {
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
