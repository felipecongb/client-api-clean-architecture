import { ApplicationError } from './application-error';

export class NotFoundError extends ApplicationError {
  constructor(entity: string) {
    super(`${entity} não encontrado`, 404);
  }
}

export class DuplicateEntityError extends ApplicationError {
  constructor(entity: string) {
    super(`${entity} com este e-mail já existe`, 409);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400);
  }
}
