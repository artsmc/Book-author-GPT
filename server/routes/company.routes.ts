import * as Boom from 'boom';
import { Request, Response, Router } from 'express';
import { companyController } from '../controllers/company/company.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.post('/add-company', (req: Request, res: Response) => {
  console.log(req.body.company);
  companyController.create(req.body).then((company: any) => {
    res.status(200).json(company);
  }).catch((err: any) => {
    res.status(500).json(err);
  });
});




export const CompanyRouter: Router = router;
