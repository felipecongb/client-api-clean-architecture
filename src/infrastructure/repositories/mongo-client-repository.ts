import { Db, ObjectId } from 'mongodb';
import { Client } from '../../domain/entities/client';
import { ClientRepository } from '../../domain/repositories/client-repository';
import { MongoBaseRepository } from './mongo-base-repository';

export class MongoClientRepository extends MongoBaseRepository<Client> implements ClientRepository {
  constructor(db: Db) {
    super(db, 'clients');
  }

  async findByEmail(email: string): Promise<Client | null> {
    const document = await this.collection.findOne({ email });
    if (!document) {
      return null;
    }
    return this.mapToEntity(document);
  }

  protected mapToEntity(document: any): Client {
    const { _id, name, email, phone, createdAt, updatedAt } = document;
    
    const client = new Client(
      {
        name,
        email,
        phone
      },
      _id.toString()
    );

    //TODO: Sobrescrever as datas com as que vieram do banco
    client.createdAt = new Date(createdAt);
    client.updatedAt = new Date(updatedAt);
    
    return client;
  }
}
