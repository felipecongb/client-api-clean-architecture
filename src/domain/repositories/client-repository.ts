import { Client } from '../entities/client';
import { BaseRepository } from './base-repository';

export interface ClientRepository extends BaseRepository<Client> {
  findByEmail(email: string): Promise<Client | null>;
}
