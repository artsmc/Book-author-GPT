import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as status from 'express-status-monitor';

import { ExpressRouter } from './routes/_Router';
import * as multer from 'multer';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const upload = multer();
// setup the logger
app.use(status());
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200MB' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Requested-With, Session, authorization, x-api-key',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // Pass to next layer of middleware
  next();
});
app.use((req, res, next)  => {
  console.log(req.originalUrl);
  next();
});
// ROUTE /APP/api
app.use(`/api/v1`, ExpressRouter);
app.listen(app.get('port'), () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log('Press CTRL-C to stop\n');
});
app.use(`/`, express.static('./client/dist/client/'));
export default app;


