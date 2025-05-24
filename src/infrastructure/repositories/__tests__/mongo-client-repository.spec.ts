import { MongoClientRepository } from '../../../infrastructure/repositories/mongo-client-repository';
import { Client } from '../../../domain/entities/client';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';

describe('MongoClientRepository', () => {
  let mongoServer: MongoMemoryServer;
  let mongoClient: MongoClient;
  let db: Db;
  let repository: MongoClientRepository;

  beforeAll(async () => {
    //TODO: Iniciar MongoDB em memória para testes
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoClient = await MongoClient.connect(uri);
    db = mongoClient.db('test-db');
    repository = new MongoClientRepository(db);
  });

  afterAll(async () => {
    if (mongoClient) {
      await mongoClient.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    //TODO: Limpar coleção antes de cada teste
    await db.collection('clients').deleteMany({});
  });

  it('deve criar um cliente com sucesso', async () => {
    //TODO: Arrange
    const client = Client.create({
      name: 'Carlos Teste',
      email: 'carlos@teste.com',
      phone: '1199887766'
    });

    //TODO: Act
    const result = await repository.create(client);

    //TODO: Assert
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Carlos Teste');
    expect(result.email).toBe('carlos@teste.com');
    expect(result.phone).toBe('1199887766');
  });

  it('deve encontrar um cliente por ID', async () => {
    //TODO: Arrange
    const client = Client.create({
      name: 'Ana Teste',
      email: 'ana@teste.com',
      phone: '1199887755'
    });
    const createdClient = await repository.create(client);

    //TODO: Act
    const foundClient = await repository.findById(createdClient.id!);

    //TODO: Assert
    expect(foundClient).not.toBeNull();
    expect(foundClient?.id).toBe(createdClient.id);
    expect(foundClient?.name).toBe('Ana Teste');
    expect(foundClient?.email).toBe('ana@teste.com');
  });

  it('deve encontrar um cliente por email', async () => {
    //TODO: Arrange
    const client = Client.create({
      name: 'Pedro Teste',
      email: 'pedro@teste.com',
      phone: '1199887744'
    });
    await repository.create(client);

    //TODO: Act
    const foundClient = await repository.findByEmail('pedro@teste.com');

    //TODO: Assert
    expect(foundClient).not.toBeNull();
    expect(foundClient?.name).toBe('Pedro Teste');
    expect(foundClient?.email).toBe('pedro@teste.com');
  });

  it('deve retornar null quando cliente não for encontrado por ID', async () => {
    //TODO: Act
    const result = await repository.findById('id-inexistente');
    
    //TODO: Assert
    expect(result).toBeNull();
  });

  it('deve retornar null quando cliente não for encontrado por email', async () => {
    //TODO: Act
    const result = await repository.findByEmail('inexistente@teste.com');
    
    //TODO: Assert
    expect(result).toBeNull();
  });

  it('deve atualizar um cliente com sucesso', async () => {
    //TODO: Arrange
    const client = Client.create({
      name: 'Márcia Original',
      email: 'marcia@teste.com',
      phone: '1199887733'
    });
    const createdClient = await repository.create(client);
    
    //TODO: Act
    const updatedClient = createdClient.update({
      name: 'Márcia Atualizada',
      phone: '1199887722'
    });
    const result = await repository.update(updatedClient);
    
    //TODO: Assert
    expect(result.name).toBe('Márcia Atualizada');
    expect(result.email).toBe('marcia@teste.com'); //TODO: mantido o mesmo
    expect(result.phone).toBe('1199887722');
    
    //TODO: Verificar se persistiu
    const foundClient = await repository.findById(createdClient.id!);
    expect(foundClient?.name).toBe('Márcia Atualizada');
  });

  it('deve listar todos os clientes', async () => {
    //TODO: Arrange
    const client1 = Client.create({
      name: 'Cliente 1',
      email: 'cliente1@teste.com',
      phone: '1199887711'
    });
    
    const client2 = Client.create({
      name: 'Cliente 2',
      email: 'cliente2@teste.com',
      phone: '1199887722'
    });
    
    await repository.create(client1);
    await repository.create(client2);
    
    //TODO: Act
    const clients = await repository.findAll();
    
    //TODO: Assert
    expect(clients).toHaveLength(2);
    expect(clients[0].name).toBe('Cliente 1');
    expect(clients[1].name).toBe('Cliente 2');
  });

  it('deve excluir um cliente com sucesso', async () => {
    //TODO: Arrange
    const client = Client.create({
      name: 'Cliente para Excluir',
      email: 'excluir@teste.com',
      phone: '1199887700'
    });
    
    const createdClient = await repository.create(client);
    
    //TODO: Act
    const deleteResult = await repository.delete(createdClient.id!);
    const foundClient = await repository.findById(createdClient.id!);
    
    //TODO: Assert
    expect(deleteResult).toBe(true);
    expect(foundClient).toBeNull();
  });
});
