import dotenv from 'dotenv';
import path from 'path';

//TODO: Carregando variáveis de ambiente do arquivo .env
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

interface IConfig {
  port: number;
  nodeEnv: string;
  mongodb: {
    uri: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  rabbitmq: {
    url: string;
    queue: string;
    exchange: string;
    routingKey: string;
  };
}

export const config: IConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/client-api?authSource=admin'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    queue: process.env.RABBITMQ_QUEUE || 'clients_queue',
    exchange: process.env.RABBITMQ_EXCHANGE || 'clients_exchange',
    routingKey: process.env.RABBITMQ_ROUTING_KEY || 'clients.created'
  }
};
