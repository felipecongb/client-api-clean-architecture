import 'module-alias/register';
import express from 'express';
import { config } from '@main/config/config';
import setupMiddleware from '@main/config/middleware';
import setupRoutes from '@main/routes';
import { setupServices } from '@main/server/setup';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@main/config/swagger';

async function startServer() {
  try {
    const app = express();
    
    //TODO: Configurar middleware
    setupMiddleware(app);
    
    //TODO: Configurar Swagger
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    //TODO: Inicializar serviços
    const { clientController } = await setupServices();
    
    //TODO: Configurar rotas
    setupRoutes(app, clientController);
    
    //TODO: Iniciar o servidor
    app.listen(config.port, () => {
      console.log(`
      ========================================
      🚀 Servidor iniciado na porta ${config.port}
      📊 Ambiente: ${config.nodeEnv}
      📚 API REST disponível em: http://localhost:${config.port}/api/v1
      📖 Documentação Swagger: http://localhost:${config.port}/api-docs
      🔍 Healthcheck em: http://localhost:${config.port}/health
      ========================================
      `);
    });
    
    //TODO: Tratamento para término gracioso
    process.on('SIGINT', async () => {
      console.log('🛑 Desligando servidor...');
      
      //TODO: Implementar lógica para fechar conexões
      const mongoConnection = await import('@infrastructure/db/mongo-connection');
      await mongoConnection.MongoConnection.getInstance().disconnect();
      
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
