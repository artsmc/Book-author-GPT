
import {
  openAIService
} from './../services/openai.service';

import {
  assemblyAIService
} from './../services/assemblyai.service';
import * as aws from 'aws-sdk';

import {
  ISpeakerSort,
  ITranscript
} from '../interfaces/transcript.interface';

import {
  TranscriptModel
} from './../models/transcripts.model';
import {
  UtilController
} from './util.controller';
import {
  awsOpts
} from './../_config/config';
import { pineconeService } from '../services/pinecode.service';



const AWS = aws;
const s3 = new AWS.S3(awsOpts);

class TranscriptController extends UtilController {
  lastResult = {};

  private convertToSeconds(time) {
    return time.replace('[', '').replace(']', '').split(':').reduce((acc, time) => (60 * acc) + +time);
  }
}

export const transcriptController = new TranscriptController();
