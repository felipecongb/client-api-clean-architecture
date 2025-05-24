import { ClientDto, CreateClientDto } from '../dtos/client-dto';
import { DuplicateEntityError } from '../errors/domain-errors';
import { MessageProducer } from '../interfaces/message-service';
import { Client } from '../../domain/entities/client';
import { ClientRepository } from '../../domain/repositories/client-repository';

export class CreateClientUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly messageProducer: MessageProducer
  ) {}

  async execute(data: CreateClientDto): Promise<ClientDto> {
    const existingClient = await this.clientRepository.findByEmail(data.email);
    if (existingClient) {
      throw new DuplicateEntityError('Cliente');
    }

    const client = Client.create(data);
    const savedClient = await this.clientRepository.create(client);

    await this.messageProducer.publish(
      'clients_exchange',
      {
        event: 'CLIENT_CREATED',
        data: savedClient
      },
      'clients.created'
    );

    return {
      id: savedClient.id!,
      name: savedClient.name,
      email: savedClient.email,
      phone: savedClient.phone,
      createdAt: savedClient.createdAt,
      updatedAt: savedClient.updatedAt
    };
  }
}
