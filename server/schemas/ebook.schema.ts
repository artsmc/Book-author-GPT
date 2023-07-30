import { Schema } from 'mongoose';
import findOneOrCreate from 'mongoose-findoneorcreate';
import prettyMilliseconds from 'pretty-ms';
import * as _ from 'lodash';

export let ebookSchema: Schema = new Schema(
  {
  language: { type: String },
  UUID: { type: String },
  title: { type: String },
  creator: { type: String },
  coverImage: { type: String },
  vectorIds: [{ type: String }],
  vectorSize: { type: Number },
  vectorQuerySize: { type: Number },
  is_active: { type: Boolean },
  is_system: { type: Boolean },
  created_at: Date,
  modified_at: Date,
  ebookStats: {
    sections: { type: Number },
    characterCount: { type: Number },
    wordCount: { type: Number },
    readingTimeText:  { type: Number },
    readingTimeMS:{ type: Number },
  },
  sections: [{
      name: { type: String },
      text: { type: String },
      sectionStats: {
          characterCount: { type: Number },
          wordCount: { type: Number },
          readingTimeText:  { type: String },
          readingTimeMinutes:  { type: Number },
          readingTimeMS:  { type: Number },
          vectorSize: { type: Number },
          vectorQuerySize: { type: Number },
        },
  }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  {
    versionKey: false,
    strict: true,
    collection: 'ebooks',
  },
);
// @ts-ignore
// ebookSchema.plugin(autopopulate);
ebookSchema.plugin(findOneOrCreate);
ebookSchema.pre<any>('findOneAndUpdate', function (next) {
  this._update['modified_at'] = new Date().toISOString();
  next();
});
ebookSchema.pre<any>('validate', function (next) {
  if (this.ebookStats && this.ebookStats.readingTimeMS) {
    this.readingTimeText = prettyMilliseconds( this.ebookStats.readingTimeMS);
  }
  if (!this.created_at) {
    this.created_at = new Date().toISOString();
  }
  if (!this.modified_at) {
    this.modified_at = new Date().toISOString();
  }
  if (!this.is_active) {
    this.is_active = true;
  }
  if (!this.is_system) {
    this.is_system = false;
  }

  next();
});
