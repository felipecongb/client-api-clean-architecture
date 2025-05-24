import { CreateClientUseCase } from '../../../application/use-cases/create-client-use-case';
import { DuplicateEntityError } from '../../../application/errors/domain-errors';
import { Client } from '../../../domain/entities/client';
import { ClientRepository } from '../../../domain/repositories/client-repository';
import { MessageProducer } from '../../../application/interfaces/message-service';

//TODO: Mock do repositório de cliente
class MockClientRepository implements ClientRepository {
  private clients: Client[] = [];

  async create(entity: Client): Promise<Client> {
    const newClient = { ...entity, id: Math.random().toString(36).substring(7) };
    this.clients.push(newClient as Client);
    return newClient as Client;
  }

  async findById(id: string): Promise<Client | null> {
    return this.clients.find(client => client.id === id) || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clients.find(client => client.email === email) || null;
  }

  async update(entity: Client): Promise<Client> {
    const index = this.clients.findIndex(client => client.id === entity.id);
    if (index >= 0) {
      this.clients[index] = entity;
    }
    return entity;
  }

  async findAll(): Promise<Client[]> {
    return this.clients;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.clients.findIndex(client => client.id === id);
    if (index >= 0) {
      this.clients.splice(index, 1);
      return true;
    }
    return false;
  }
}

//TODO: Mock do serviço de mensagens
class MockMessageProducer implements MessageProducer {
  messages: any[] = [];

  async publish<T>(topic: string, message: T, routingKey?: string): Promise<void> {
    this.messages.push({ topic, message, routingKey });
  }
}

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase;
  let mockClientRepository: MockClientRepository;
  let mockMessageProducer: MockMessageProducer;

  beforeEach(() => {
    mockClientRepository = new MockClientRepository();
    mockMessageProducer = new MockMessageProducer();
    createClientUseCase = new CreateClientUseCase(
      mockClientRepository,
      mockMessageProducer
    );
  });

  it('deve criar um cliente com sucesso', async () => {
    //TODO: Arrange
    const clientData = {
      name: 'Maria Silva',
      email: 'maria@example.com',
      phone: '11987654321'
    };

    //TODO: Act
    const result = await createClientUseCase.execute(clientData);

    //TODO: Assert
    expect(result).toEqual(expect.objectContaining({
      id: expect.any(String),
      name: 'Maria Silva',
      email: 'maria@example.com',
      phone: '11987654321',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }));

    //TODO: Verificar se a mensagem foi publicada
    expect(mockMessageProducer.messages).toHaveLength(1);
    expect(mockMessageProducer.messages[0]).toEqual({
      topic: 'clients_exchange',
      message: {
        event: 'CLIENT_CREATED',
        data: expect.objectContaining({
          name: 'Maria Silva',
          email: 'maria@example.com'
        })
      },
      routingKey: 'clients.created'
    });
  });

  it('deve lançar erro ao tentar criar cliente com email duplicado', async () => {
    //TODO: Arrange
    const existingClient = Client.create({
      name: 'Usuário Existente',
      email: 'existente@example.com',
      phone: '11999999999'
    });
    
    await mockClientRepository.create(existingClient);

    const duplicateData = {
      name: 'Outro Usuário',
      email: 'existente@example.com', //TODO: mesmo email
      phone: '11988888888'
    };

    //TODO: Act & Assert
    await expect(createClientUseCase.execute(duplicateData)).rejects.toThrow(DuplicateEntityError);
    await expect(createClientUseCase.execute(duplicateData)).rejects.toThrow('Cliente com este e-mail já existe');
  });
});
