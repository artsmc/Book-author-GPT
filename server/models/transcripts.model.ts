import { ITranscript } from './../interfaces/transcript.interface';
import { transcriptSchema } from '../schemas/transcript.schema';
import * as mongoose from 'mongoose';
import { mongoSetup } from '../_config/config';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const TranscriptModel: mongoose.Model<ITranscript> = mongoose.model<ITranscript>(
  'Transcripts',
  transcriptSchema,
);
