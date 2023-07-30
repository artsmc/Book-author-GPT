import * as Boom from 'boom';

import { Request, Response, Router } from 'express';

import { middlewareController } from '../controllers/middlware.controller';
import { userController } from '../controllers/user/user.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.get('/my-account', middlewareController.isAuth,(req: Request, res: Response) => {
  userController.findById(req.body.decode).then((user: any) => {
    res.status(200).json(user);
  }).catch((err: any) => {
    res.status(500).json(err);
  });
});
router.post('/update-my-account', middlewareController.isAuth, middlewareController.isValidCompany, (req: Request, res: Response) => {
  userController.update(req.body).then((user: any) => {
    res.status(200).json(user);
  }).catch((err: any) => {
    res.status(500).json(err);
  });
});



export const UserRouter: Router = router;
