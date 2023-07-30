
import * as Boom from 'boom';
import { Request, Response, Router } from 'express';
// @ts-ignore
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../_config/config';
import { authController } from '../controllers/auth.controller';
import { middlewareController } from '../controllers/middlware.controller';
const router: Router = Router();
export const passAuth = (req: Request, res: Response, next: () => void) => {
    if (req.headers['authorization']) {
      const jwtToken = (req.headers.authorization).split(' ');
      jwt.verify(jwtToken[1], jwtSecret, (err, decoded) => {
        if (err) {
        } else {
          req.body.authorization = req.headers.authorization;
          next();
        }
      });
    } else {
      res.status(500).send(Boom.badRequest('invalid query', {
        auth: false,
        jwtToken: 'you need proper token to authorize.'
      }));
    }
  }
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json(req.headers);
});
router.post('/login', (req: Request, res: Response) => {
  authController.loginUser(req.body).then((user: any) => {
    res.status(200).json(user);
  }
  ).catch((err: any) => {
    res.status(500).json(err);
  }
  );
});
router.post('/create', middlewareController.userValidation, (req: Request, res: Response) => {
  authController.createUser({...req.body, 
    user_agent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    referrer: req.headers['referrer'] || req.headers['referer']
  }).then((user: any) => {
    res.status(200).json(user);
  }).catch((err: any) => {
      res.status(500).json(err);
  });
});
router.post('/verify', middlewareController.isAuth, (req: Request, res: Response) => {
  authController.reissueToken(req.body.decode.user).then((user: any) => {
    res.status(200).json(user);
  }
  ).catch((err: any) => {
    res.status(500).json(err);
  }
  );
});
router.post('/change-password', (req: Request, res: Response) => {
  authController.changePassword(req.body).then((user: any) => {
    res.status(200).json(user);
  } ).catch((err: any) =>
    res.status(500).json(err)
  );
});
router.get('/delete', (req: Request, res: Response) => {

});

// @ts-ignore

export const AuthRouter: Router = router;
