import * as Boom from 'boom';

import { Request, Response, Router } from 'express';


const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});


export const HookRouter: Router = router;
