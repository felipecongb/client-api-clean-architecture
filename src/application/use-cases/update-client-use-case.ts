import { ClientDto, UpdateClientDto } from '../dtos/client-dto';
import { NotFoundError } from '../errors/domain-errors';
import { CacheService } from '../interfaces/cache-service';
import { MessageProducer } from '../interfaces/message-service';
import { ClientRepository } from '../../domain/repositories/client-repository';

export class UpdateClientUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly cacheService: CacheService,
    private readonly messageProducer: MessageProducer
  ) {}

  async execute(id: string, data: UpdateClientDto): Promise<ClientDto> {
    //TODO: Verificar se o cliente existe
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundError('Cliente');
    }

    //TODO: Atualizar cliente
    const updatedClient = client.update(data);
    const savedClient = await this.clientRepository.update(updatedClient);

    //TODO: Invalidar cache
    await this.cacheService.delete(`client:${id}`);

    //TODO: Publicar evento de cliente atualizado
    await this.messageProducer.publish(
      'clients_exchange',
      {
        event: 'CLIENT_UPDATED',
        data: savedClient
      },
      'clients.updated'
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
