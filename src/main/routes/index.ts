import { Express, Router } from 'express';
import clientRoutes from './client-routes';
import { ClientController } from '../../presentation/controllers/client-controller';

export default (app: Express, clientController: ClientController): void => {
  const apiRouter = Router();
  
  //TODO: Adiciona todas as rotas em /api/v1
  apiRouter.use('/v1', clientRoutes(clientController));
  
  //TODO: Configura o roteador principal na aplicação
  app.use('/api', apiRouter);
  
  //TODO: Rota de status/healthcheck
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  });
}
