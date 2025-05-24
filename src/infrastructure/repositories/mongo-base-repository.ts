import { Collection, Db, ObjectId } from 'mongodb';
import { BaseEntity } from '../../domain/entities/base-entity';
import { BaseRepository } from '../../domain/repositories/base-repository';

export abstract class MongoBaseRepository<T extends BaseEntity<any>> implements BaseRepository<T> {
  protected collection: Collection;

  constructor(
    protected readonly db: Db, 
    protected readonly collectionName: string
  ) {
    this.collection = this.db.collection(collectionName);
  }

  async create(entity: T): Promise<T> {
    const { id, ...entityWithoutId } = entity as any;
    const result = await this.collection.insertOne(entityWithoutId);
    return this.mapToEntity({ _id: result.insertedId, ...entityWithoutId });
  }

  async update(entity: T): Promise<T> {
    const { id, ...entityWithoutId } = entity as any;
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...entityWithoutId } }
    );
    return entity;
  }

  async findById(id: string): Promise<T | null> {
    try {
      const document = await this.collection.findOne({ _id: new ObjectId(id) });
      if (!document) {
        return null;
      }
      return this.mapToEntity(document);
    } catch (error) {
      //TODO: Retornar null se o ID não for um ObjectId válido
      return null;
    }
  }

  async findAll(): Promise<T[]> {
    const documents = await this.collection.find().toArray();
    return documents.map(document => this.mapToEntity(document));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  protected abstract mapToEntity(document: any): T;
}
