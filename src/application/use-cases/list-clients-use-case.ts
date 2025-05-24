import { ClientDto } from '../dtos/client-dto';
import { ClientRepository } from '../../domain/repositories/client-repository';

export class ListClientsUseCase {
  constructor(
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(): Promise<ClientDto[]> {
    const clients = await this.clientRepository.findAll();

    return clients.map(client => ({
      id: client.id!,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    }));
  }
}
