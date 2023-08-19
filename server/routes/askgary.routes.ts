import * as Boom from 'boom';

import { Request, Response, Router } from 'express';
import { askGaryController } from '../controllers/askgary.controller';


const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});
router.post('/search/', (req: Request, res: Response) => {
    askGaryController.searchInquery(req.body.query).then(results => {
      res.status(200).json(results);
    }).catch(error => {
      console.error(error);
      res.status(400).send(Boom.badRequest(error));
    });
  });
  router.post('/respond/', (req: Request, res: Response) => {
    askGaryController.returnMessage(req.body.query).then(results => {
      res.status(200).json(results);
    }).catch(error => {
      console.error(error);
      res.status(400).send(Boom.badRequest(error));
    });
  });

export const AskGaryRouter: Router = router;
