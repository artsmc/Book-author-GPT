import { assemblyAIService } from './../services/assemblyai.service';
import * as Boom from 'boom';
import { Request, Response, Router } from 'express';
import { transcriptController } from './../controllers/transcript.controller';
import { middlewareController } from '../controllers/middlware.controller';

const router: Router = Router();

router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});
router.post('/upload', (req: Request, res: Response) => {
  transcriptController.storeTranscript(req.body.file, req.body.namespace).then(transcript => {
    res.status(200).json(transcript);
  })
  .catch(error => {
    console.error(error);
    res.status(400).send(Boom.badRequest(error));
  });
});
router.get('/by-id/:id', middlewareController.validTranscript, (req: Request, res: Response) => {
  res.status(200).json(req.body.transcript);
});
router.post('/search', (req: Request, res: Response) => {
    transcriptController.searchTranscripts(req.body.namespace, req.body.query).then(transcripts => {
      res.status(200).json(transcripts);
    })
      .catch(error => {
        console.error(error);
        res.status(400).send(Boom.badRequest(error));
    });
  });
router.post('/update-all-label/:id', middlewareController.validTranscript, (req: Request, res: Response) => {
  transcriptController.updateAllSpeakersWith(req.body).then(transcriptState => {
    res.status(200).json(transcriptState);
  })
    .catch(error => {
      res.status(400).send(Boom.badRequest('transcript error', error));
    });
});
router.get('/unique-speakers/:id', middlewareController.validTranscript, (req: Request, res: Response) => {
  transcriptController.findUniqueSpeakers(req.body).then(speakers => {
    res.status(200).json(speakers);
  })
    .catch(error => {
      res.status(400).send(Boom.badRequest('transcript error', error));
    });
});
router.post('/remap-assembly-transcript/:id', middlewareController.validTranscript, (req: Request, res: Response) => {
  transcriptController.remapTranscript(req.body).then(transcriptState => {
    res.status(200).json(transcriptState);
  })
    .catch(error => {
      res.status(400).send(Boom.badRequest('transcript error', error));
    });
});
router.get('/test-transcript', (req: Request, res: Response) => {
  // @ts-ignore
  assemblyAIService.Transcript(req.query.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(401).json(err)
    );
});

export const TranscriptRouter: Router = router;
