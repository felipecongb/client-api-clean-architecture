import { config } from '../config/config';
import { Db } from 'mongodb';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache-service';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq-service';
import { ClientEventConsumer } from '../../infrastructure/messaging/client-event-consumer';
import { DependencyFactory } from '../factories/dependency-factory';

export async function setupServices() {
  try {
    console.log('🔄 Iniciando serviços...');
    
    //TODO: Inicializar MongoDB
    console.log('📦 Conectando ao MongoDB...');
    const db: Db = await DependencyFactory.createMongoDb();
    
    //TODO: Inicializar Redis
    console.log('🔄 Conectando ao Redis...');
    const cacheService: RedisCacheService = DependencyFactory.createCacheService();
    
    //TODO: Inicializar RabbitMQ
    console.log('📨 Conectando ao RabbitMQ...');
    const messageService: RabbitMQService = DependencyFactory.createMessageService();
    await messageService.initialize();
    
    //TODO: Configurar queues e exchanges
    console.log('🔗 Configurando filas e exchanges...');
    await messageService.setupQueue(
      config.rabbitmq.exchange,
      config.rabbitmq.queue,
      config.rabbitmq.routingKey
    );
    
    //TODO: Iniciar consumidor de eventos
    console.log('👂 Iniciando consumidor de eventos...');
    const clientEventConsumer: ClientEventConsumer = DependencyFactory.createClientEventConsumer(messageService);
    await clientEventConsumer.start(config.rabbitmq.queue);
    
    //TODO: Criar controlador de cliente
    const clientController = DependencyFactory.createClientController(db, cacheService, messageService);
    
    console.log('✅ Todos os serviços inicializados com sucesso!');
    
    return {
      db,
      cacheService,
      messageService,
      clientController
    };
  } catch (error) {
    console.error('❌ Erro ao configurar serviços:', error);
    throw error;
  }
}
