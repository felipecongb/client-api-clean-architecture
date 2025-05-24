import { ClientDto } from '../dtos/client-dto';
import { NotFoundError } from '../errors/domain-errors';
import { CacheService } from '../interfaces/cache-service';
import { ClientRepository } from '../../domain/repositories/client-repository';

export class GetClientUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly cacheService: CacheService
  ) {}

  async execute(id: string): Promise<ClientDto> {
    const cachedClient = await this.cacheService.get<ClientDto>(`client:${id}`);
    if (cachedClient) {
      return cachedClient;
    }

    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundError('Cliente');
    }

    const clientDto = {
      id: client.id!,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };

    //TODO: TODO: Armazenar no cache por 5 minutos (300 segundos)
    await this.cacheService.set(`client:${id}`, clientDto, 300);

    return clientDto;
  }
}
