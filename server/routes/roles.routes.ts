import * as Boom from 'boom';

import { Request, Response, Router } from 'express';

import { middlewareController } from '../controllers/middlware.controller';
import { roleController } from '../controllers/role/role.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.post('/add-role', (req: Request, res: Response) => {
  roleController.create(req.body).then((role: any) => {
    res.status(200).json(role);
  }).catch((err: any) => {
    res.status(500).json(err);
  });
});




export const RolesRouter: Router = router;
