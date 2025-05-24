import { MongoClient, Db } from 'mongodb';

export class MongoConnection {
  private static instance: MongoConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  async connect(uri: string, dbName?: string): Promise<Db> {
    if (this.client && this.db) {
      return this.db;
    }

    try {
      this.client = await MongoClient.connect(uri);
      this.db = this.client.db(dbName);
      console.log('📦 Conectado ao MongoDB com sucesso!');
      return this.db;
    } catch (error) {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('📦 Desconectado do MongoDB com sucesso!');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB não está conectado. Chame connect() primeiro.');
    }
    return this.db;
  }
}
