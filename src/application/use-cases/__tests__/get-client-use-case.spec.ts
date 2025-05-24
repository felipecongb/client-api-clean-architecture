import { GetClientUseCase } from '../../../application/use-cases/get-client-use-case';
import { NotFoundError } from '../../../application/errors/domain-errors';
import { Client } from '../../../domain/entities/client';
import { ClientRepository } from '../../../domain/repositories/client-repository';
import { CacheService } from '../../../application/interfaces/cache-service';

class MockClientRepository implements ClientRepository {
  private readonly clients: Client[] = [];
  
  constructor(initialClients: Client[] = []) {
    this.clients = initialClients;
  }
  
  async create(entity: Client): Promise<Client> {
    this.clients.push(entity);
    return entity;
  }

  async update(entity: Client): Promise<Client> {
    const index = this.clients.findIndex(c => c.id === entity.id);
    if (index >= 0) {
      this.clients[index] = entity;
    }
    return entity;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.clients.find(c => c.id === id);
    return client || null;
  }

  async findAll(): Promise<Client[]> {
    return [...this.clients];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index >= 0) {
      this.clients.splice(index, 1);
      return true;
    }
    return false;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.clients.find(c => c.email === email);
    return client || null;
  }
}

class MockCacheService implements CacheService {
  private readonly cache: Map<string, any> = new Map();
  
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.cache.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get(key) as T || null;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async flush(): Promise<void> {
    this.cache.clear();
  }
}

describe('GetClientUseCase', () => {
  let getClientUseCase: GetClientUseCase;
  let mockClientRepository: ClientRepository;
  let mockCacheService: CacheService;
  
  beforeEach(() => {
    //TODO: Criar um cliente de teste
    const clientTest = new Client({
      name: 'João da Silva',
      email: 'joao@example.com',
      phone: '11999887766'
    }, '1');
    
    mockClientRepository = new MockClientRepository([clientTest]);
    mockCacheService = new MockCacheService();
    getClientUseCase = new GetClientUseCase(mockClientRepository, mockCacheService);
  });

  it('deve retornar um cliente quando ele existe', async () => {
    //TODO: Act
    const result = await getClientUseCase.execute('1');

    //TODO: Assert
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      name: 'João da Silva',
      email: 'joao@example.com',
      phone: '11999887766'
    }));
  });

  it('deve lançar NotFoundError quando o cliente não existe', async () => {
    //TODO: Act & Assert
    await expect(getClientUseCase.execute('9999')).rejects.toThrow(NotFoundError);
    await expect(getClientUseCase.execute('9999')).rejects.toThrow('Cliente não encontrado');
  });

  it('deve retornar cliente do cache quando disponível', async () => {
    //TODO: Arrange
    const cachedClient = {
      id: '1',
      name: 'João da Silva (Cache)',
      email: 'joao@example.com',
      phone: '11999887766',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await mockCacheService.set('client:1', cachedClient);
    
    //TODO: Spy no repositório para verificar que não foi chamado
    const findByIdSpy = jest.spyOn(mockClientRepository, 'findById');
    
    //TODO: Act
    const result = await getClientUseCase.execute('1');
    
    //TODO: Assert
    expect(result).toEqual(cachedClient);
    expect(findByIdSpy).not.toHaveBeenCalled();
  });

  it('deve armazenar em cache após buscar do repositório', async () => {
    //TODO: Arrange
    const cacheSpy = jest.spyOn(mockCacheService, 'set');
    
    //TODO: Act
    await getClientUseCase.execute('1');
    
    //TODO: Assert
    expect(cacheSpy).toHaveBeenCalledWith(
      'client:1',
      expect.objectContaining({
        id: '1',
        name: 'João da Silva'
      }),
      300
    );
  });
});
