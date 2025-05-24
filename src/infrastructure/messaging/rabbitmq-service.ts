import * as amqp from 'amqplib';
import { Channel } from 'amqplib';

interface CustomConnection {
  createChannel: () => Promise<Channel>;
  on: (event: string, listener: (...args: any[]) => void) => void;
  close: () => Promise<void>;
}

export class RabbitMQService {
  private connection: CustomConnection | null = null;
  private channel: Channel | null = null;

  constructor(private readonly url: string) {}

  async initialize(): Promise<void> {
    try {
      this.connection = (await amqp.connect(this.url)) as CustomConnection;
      this.channel = await this.connection.createChannel();
      console.log('📨 Conectado ao RabbitMQ com sucesso!');

      this.connection.on('error', (err) => {
        console.error('❌ Erro na conexão com o RabbitMQ:', err);
        this.reconnect();
      });

      this.connection.on('close', () => {
        console.warn('⚠️ Conexão com o RabbitMQ fechada, tentando reconectar...');
        this.reconnect();
      });
    } catch (error) {
      console.error('❌ Erro ao inicializar conexão com o RabbitMQ:', error);
      throw error;
    }
  }

  private async reconnect(): Promise<void> {
    setTimeout(async () => {
      try {
        console.log('🔁 Tentando reconectar ao RabbitMQ...');
        await this.initialize();
      } catch (error) {
        console.error('❌ Falha na tentativa de reconexão com RabbitMQ:', error);
      }
    }, 5000);
  }

  async publish<T>(exchange: string, message: T, routingKey: string = ''): Promise<void> {
    if (!this.channel) {
      throw new Error('Canal RabbitMQ não inicializado. Chame initialize() primeiro.');
    }

    try {
      await this.channel.assertExchange(exchange, 'topic', { durable: true });
      this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
      console.log(`📤 Mensagem publicada na exchange ${exchange} com routing key ${routingKey}`);
    } catch (error) {
      console.error('❌ Erro ao publicar mensagem:', error);
      throw error;
    }
  }

  async subscribe<T>(queue: string, callback: (message: T) => Promise<void>): Promise<void> {
    if (!this.channel) {
      throw new Error('Canal RabbitMQ não inicializado. Chame initialize() primeiro.');
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      console.log(`📥 Consumindo mensagens da fila ${queue}...`);
      this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString()) as T;
            await callback(content);
            this.channel?.ack(msg);
          } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
            this.channel?.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      console.error('❌ Erro ao se inscrever na fila:', error);
      throw error;
    }
  }

  async setupQueue(exchange: string, queue: string, routingKey: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Canal RabbitMQ não inicializado. Chame initialize() primeiro.');
    }

    try {
      //TODO: Excluir a exchange existente, se necessário
      try {
        await this.channel.deleteExchange(exchange);
        console.log(`🔄 Exchange '${exchange}' excluída para recriação.`);
      } catch (error) {
        if (error instanceof Error) {
          console.warn(`⚠️ Não foi possível excluir a exchange '${exchange}':`, error.message);
        } else {
          console.warn(`⚠️ Não foi possível excluir a exchange '${exchange}': Erro desconhecido.`);
        }
      }

      //TODO: Recriar a exchange com o tipo correto
      await this.channel.assertExchange(exchange, 'direct', { durable: true });
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, exchange, routingKey);
      console.log(`🔗 Fila '${queue}' configurada e ligada à exchange '${exchange}' com routing key '${routingKey}'`);
    } catch (error) {
      console.error('❌ Erro ao configurar fila e exchange:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('📨 Conexão com o RabbitMQ fechada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao fechar conexão com o RabbitMQ:', error);
    }
  }
}
