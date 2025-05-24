import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import helmet from 'helmet';
import { ErrorHandlerMiddleware } from '../../presentation/middlewares/error-handler-middleware';

export default (app: Express): void => {
  //TODO: Segurança
  app.use(helmet());
  
  //TODO: Body parsing
  app.use(express.json());
  
  //TODO: Logging
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
  
  //TODO: CORS
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  //TODO: Tratamento de erro global
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandlerMiddleware.handle(err, req, res, next);
  });
}
