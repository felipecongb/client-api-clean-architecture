import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '../../application/errors/application-error';
import { ValidationError } from '../../application/errors/domain-errors';

export class ErrorHandlerMiddleware {
  static handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);

    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({
        error: {
          message: err.message,
          code: err.constructor.name
        }
      });
      return;
    }

    //TODO: Erro de validação do Zod
    if (err.name === 'ZodError') {
      res.status(400).json({
        error: {
          message: 'Erro de validação',
          details: err,
          code: 'ValidationError'
        }
      });
      return;
    }

    //TODO: Erro desconhecido/não tratado
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        code: 'InternalServerError'
      }
    });
  }
}
