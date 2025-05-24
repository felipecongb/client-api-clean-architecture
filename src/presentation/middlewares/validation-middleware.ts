import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { ValidationError } from '../../application/errors/domain-errors';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error: any) {
      //TODO: Retorna o primeiro erro de validação
      const errorMessage = error.errors?.[0]?.message || 'Erro de validação';
      next(new ValidationError(errorMessage));
    }
  };
};
