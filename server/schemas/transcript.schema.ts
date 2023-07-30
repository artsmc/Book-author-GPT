import * as Joi from 'joi';
import * as  autopopulate from 'mongoose-autopopulate';

import { Schema } from 'mongoose';

export let transcriptValidationSchema = Joi.object({
  podcast: Joi.string().allow('').required(),
});

export let transcriptSchema: Schema = new Schema(
  {
    audio: {
      type: Schema.Types.ObjectId,
      ref: 'Audio',
      autopopulate: true
    },
    podcast: {
      type: Schema.Types.ObjectId,
      ref: 'Podcast',
      autopopulate: true
    },
    tone: {
      type: Schema.Types.ObjectId,
      ref: 'Tones',
      autopopulate: true
    },
    style: {
      type: Schema.Types.ObjectId,
      ref: 'Styles',
      autopopulate: true
    },
    podcast_name: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    status: { type: String },
    aiKey: { type: String },
    jobName: { type: String },
    start_at: { type: Number },
    key: { type: String },
    topic: { type: String },
    sentenceSplitNoStop: [{ type: String }],
    speakerCount: { type: Schema.Types.Mixed },

    vectorId: [{ type: String }],
    vectorSize: { type: Number },
    vectorQuerySize: { type: Number },
    
    wordsSplit: [{ type: String }],
    dictionary: [{
      start_time: { type: Number },
      end_time: { type: Number },
      order: { type: Number },
      confidence: { type: Number }
    }],
    fullTranscript: { type: String },
    trimmedTranscript: { type: String },
    headlineOptions: [{ type: String }],
    noStopWord: { type: String },
    transcriptStats: {
      tokens: { type: Number },
      summaryTokens: { type: Number },
      wordCount: { type: Number },
      trimmedCount: { type: Number },
    },
    sentenceSplit: [{ type: String }],
    speakerSort: [
      {
        start_time: { type: Number },
        end_time: { type: Number },
        speaker_label: { type: String },
        wordsSplit: [{ type: String }],
        dictionary: [{
          start_time: { type: Number },
          end_time: { type: Number },
          order: { type: Number },
          confidence: { type: Number }
        }],
        confidenceSplit: [{ type: String }],
        sentenceSplit: [{ type: String }],
        transcript: { type: String },
        noStopWord: { type: String },
        audioQuality: {
          low: { type: String },
          med: { type: String },
          high: { type: String },
        }
      }
    ],
    is_active: { type: Boolean },
    is_system: { type: Boolean },
    created_at: Date,
    modified_at: Date,
  },
  {
    versionKey: false,
    strict: true,
    collection: 'transcripts',
  },
);
// @ts-ignore
transcriptSchema.plugin(autopopulate);
transcriptSchema.pre<any>('findOneAndUpdate', function (next) {
  this._update['modified_at'] = new Date().toISOString();
  next();
});
transcriptSchema.pre<any>('validate', function (next) {
  if (!this.created_at) {
    this.created_at = new Date().toISOString();
  }
  if (!this.start_at) {
    this.start_at = 0;
  }
  if (!this.key) {
    this.key = 'important point';
  }
  if (!this.is_active) {
    this.is_active = true;
  }
  if (!this.is_system) {
    this.is_system = false;
  }
  if (!this.status) {
    this.status = 'PROCESSING';
  }
  next();
});
