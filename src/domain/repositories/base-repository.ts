import { BaseEntity } from '../entities/base-entity';

export interface BaseRepository<T extends BaseEntity<any>> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<boolean>;
}
