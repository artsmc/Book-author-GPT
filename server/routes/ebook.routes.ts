import * as Boom from 'boom';
import { Request, Response, Router } from 'express';
import { eBooksController } from '../controllers/ebooks.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});
  router.post('/upload', (req: Request, res: Response) => {
    eBooksController.storeEBook(req.body.file, req.body.namespace).then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(Boom.badRequest(error));
    });
  })
  router.get('/book/:id', (req: Request, res: Response) => {
    eBooksController.getEBook(req.params.id).then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(Boom.badRequest(error));
    });
  });
  router.get('/books/', (req: Request, res: Response) => {
    eBooksController.getEBookList().then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(Boom.badRequest(error));
    });
  });
  router.delete('/book/:id', (req: Request, res: Response) => {
    eBooksController.deleteBook(req.params.id).then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(Boom.badRequest(error));
    });
  });
  router.delete('/book/index/:id', (req: Request, res: Response) => {
    eBooksController.deleteBookIndex(req.params.id).then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(Boom.badRequest(error));
    });
  });
  router.post('/book/search/:id', (req: Request, res: Response) => {
    eBooksController.searchBooks(req.params.id, req.body.query).then(book => {
      res.status(200).json(book);
    })
      .catch(error => {
        console.error(error);
        res.status(400).send(Boom.badRequest(error));
    });
  });
  router.post('/search/', (req: Request, res: Response) => {
    eBooksController.searchBooksbyNamespace(req.body.namespace, req.body.query).then(book => {
      res.status(200).json(book);
    })
      .catch(error => {
        console.error(error);
        res.status(400).send(Boom.badRequest(error));
    });
  });
  router.post('/book/gpt/:id', (req: Request, res: Response) => {
    eBooksController.returnMessage(req.params.id, req.body.query, req.body).then(book => {
      res.status(200).json(book);
    })
      .catch(error => {
        console.error(error);
        res.status(400).send(Boom.badRequest(error));
    });
  });


export const EBookRouter: Router = router;
