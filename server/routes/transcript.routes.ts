import { assemblyAIService } from './../services/assemblyai.service';
import * as Boom from 'boom';
import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';
import *as fs from 'fs';
import { middlewareController } from './../controllers/middlware.controller';
import { transcriptController } from './../controllers/transcript.controller';

const router: Router = Router();

router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});
router.get('/test-transcript', (req: Request, res: Response) => {
  // @ts-ignore
  assemblyAIService.Transcript(req.query.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(401).json(err)
    );
});

export const TranscriptRouter: Router = router;
