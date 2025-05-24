import { Db } from 'mongodb';
import { config } from '../config/config';
import { MongoConnection } from '../../infrastructure/db/mongo-connection';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache-service';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq-service';
import { ClientEventConsumer } from '../../infrastructure/messaging/client-event-consumer';
import { MongoClientRepository } from '../../infrastructure/repositories/mongo-client-repository';
import { CreateClientUseCase } from '../../application/use-cases/create-client-use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client-use-case';
import { GetClientUseCase } from '../../application/use-cases/get-client-use-case';
import { ListClientsUseCase } from '../../application/use-cases/list-clients-use-case';
import { ClientController } from '../../presentation/controllers/client-controller';

export class DependencyFactory {
  //TODO: Database
  static async createMongoDb(): Promise<Db> {
    const connection = MongoConnection.getInstance();
    return connection.connect(config.mongodb.uri);
  }

  //TODO: Cache
  static createCacheService(): RedisCacheService {
    return new RedisCacheService({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password
    });
  }

  //TODO: Messaging
  static createMessageService(): RabbitMQService {
    return new RabbitMQService(config.rabbitmq.url);
  }

  //TODO: Repositories
  static createClientRepository(db: Db): MongoClientRepository {
    return new MongoClientRepository(db);
  }

  //TODO: Use Cases
  static createClientUseCases(db: Db, cacheService: RedisCacheService, messageService: RabbitMQService) {
    const clientRepository = this.createClientRepository(db);
    
    const createClientUseCase = new CreateClientUseCase(
      clientRepository, 
      messageService
    );
    
    const updateClientUseCase = new UpdateClientUseCase(
      clientRepository,
      cacheService,
      messageService
    );
    
    const getClientUseCase = new GetClientUseCase(
      clientRepository,
      cacheService
    );
    
    const listClientsUseCase = new ListClientsUseCase(
      clientRepository
    );
    
    return {
      createClientUseCase,
      updateClientUseCase,
      getClientUseCase,
      listClientsUseCase
    };
  }

  //TODO: Controllers
  static createClientController(
    db: Db, 
    cacheService: RedisCacheService, 
    messageService: RabbitMQService
  ): ClientController {
    const useCases = this.createClientUseCases(db, cacheService, messageService);
    
    return new ClientController(
      useCases.createClientUseCase,
      useCases.updateClientUseCase,
      useCases.getClientUseCase,
      useCases.listClientsUseCase
    );
  }

  static createClientEventConsumer(messageService: RabbitMQService): ClientEventConsumer {
    return new ClientEventConsumer(messageService);
  }
}
