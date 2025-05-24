import Redis from 'ioredis';
import { CacheService } from '../../application/interfaces/cache-service';

export class RedisCacheService implements CacheService {
  private readonly client: Redis;

  constructor(options: {
    host: string;
    port: number;
    password?: string;
  }) {
    this.client = new Redis({
      host: options.host,
      port: options.port,
      password: options.password || undefined,
    });

    this.client.on('connect', () => {
      console.log('🔄 Conectado ao Redis com sucesso!');
    });

    this.client.on('error', (error) => {
      console.error('❌ Erro na conexão com o Redis:', error);
    });
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    
    if (!value) {
      return null;
    }
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`❌ Erro ao fazer parse do valor do cache para a chave ${key}:`, error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async flush(): Promise<void> {
    await this.client.flushall();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
