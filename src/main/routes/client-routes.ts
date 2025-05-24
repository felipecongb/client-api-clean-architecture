import { Router } from 'express';
import { ClientController } from '../../presentation/controllers/client-controller';
import { validateRequest } from '../../presentation/middlewares/validation-middleware';
import { createClientSchema, updateClientSchema } from '../../presentation/validators/client-validator';
import { z } from 'zod';

export default (clientController: ClientController): Router => {
  const router = Router();
  
  //TODO: Esquemas para validação de parâmetros
  const idParamSchema = z.object({
    params: z.object({
      id: z.string().min(1, 'ID é obrigatório')
    })
  });

  //TODO: Esquemas para validação de corpo de requisição
  const createBodySchema = z.object({
    body: createClientSchema
  });

  const updateBodySchema = z.object({
    body: updateClientSchema,
    params: z.object({
      id: z.string().min(1, 'ID é obrigatório')
    })
  });
  
  //TODO: Rotas para os clientes
  router.post('/clients', 
    validateRequest(createBodySchema),
    (req, res) => clientController.create(req, res)
  );
  
  router.put('/clients/:id', 
    validateRequest(updateBodySchema),
    (req, res) => clientController.update(req, res)
  );
  
  router.get('/clients/:id', 
    validateRequest(idParamSchema),
    (req, res) => clientController.getById(req, res)
  );
  
  router.get('/clients', 
    (req, res) => clientController.getAll(req, res)
  );
  
  return router;
}
