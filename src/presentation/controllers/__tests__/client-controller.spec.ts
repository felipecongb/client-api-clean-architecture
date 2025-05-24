import { Request, Response } from 'express';
import { ClientController } from '../../../presentation/controllers/client-controller';
import { CreateClientUseCase } from '../../../application/use-cases/create-client-use-case';
import { GetClientUseCase } from '../../../application/use-cases/get-client-use-case';
import { ListClientsUseCase } from '../../../application/use-cases/list-clients-use-case';
import { UpdateClientUseCase } from '../../../application/use-cases/update-client-use-case';
import { NotFoundError } from '../../../application/errors/domain-errors';

//TODO: Mock dos casos de uso
const mockCreateClientUseCase = {
  execute: jest.fn()
};

const mockUpdateClientUseCase = {
  execute: jest.fn()
};

const mockGetClientUseCase = {
  execute: jest.fn()
};

const mockListClientsUseCase = {
  execute: jest.fn()
};

//TODO: Mock para Request e Response
const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  req.params = {};
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('ClientController', () => {
  let clientController: ClientController;
  
  beforeEach(() => {
    clientController = new ClientController(
      mockCreateClientUseCase as unknown as CreateClientUseCase,
      mockUpdateClientUseCase as unknown as UpdateClientUseCase,
      mockGetClientUseCase as unknown as GetClientUseCase,
      mockListClientsUseCase as unknown as ListClientsUseCase
    );
    
    jest.clearAllMocks();
  });
  
  describe('create', () => {
    it('deve criar um cliente com sucesso e retornar 201', async () => {
      //TODO: Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        name: 'Cliente Teste',
        email: 'teste@example.com',
        phone: '11999887766'
      };
      
      const mockClient = {
        id: '123',
        name: 'Cliente Teste',
        email: 'teste@example.com',
        phone: '11999887766',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockCreateClientUseCase.execute.mockResolvedValue(mockClient);
      
      //TODO: Act
      await clientController.create(req, res);
      
      //TODO: Assert
      expect(mockCreateClientUseCase.execute).toBeCalledWith({
        name: 'Cliente Teste',
        email: 'teste@example.com',
        phone: '11999887766'
      });
      
      expect(res.status).toBeCalledWith(201);
      expect(res.json).toBeCalledWith(mockClient);
    });
  });
  
  describe('update', () => {
    it('deve atualizar um cliente com sucesso e retornar 200', async () => {
      //TODO: Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.id = '123';
      req.body = {
        name: 'Cliente Atualizado',
        phone: '11999887755'
      };
      
      const mockClient = {
        id: '123',
        name: 'Cliente Atualizado',
        email: 'existente@example.com',
        phone: '11999887755',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockUpdateClientUseCase.execute.mockResolvedValue(mockClient);
      
      //TODO: Act
      await clientController.update(req, res);
      
      //TODO: Assert
      expect(mockUpdateClientUseCase.execute).toBeCalledWith('123', {
        name: 'Cliente Atualizado',
        phone: '11999887755'
      });
      
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockClient);
    });
  });
  
  describe('getById', () => {
    it('deve obter um cliente com sucesso e retornar 200', async () => {
      //TODO: Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.id = '123';
      
      const mockClient = {
        id: '123',
        name: 'Cliente Encontrado',
        email: 'encontrado@example.com',
        phone: '11999887744',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockGetClientUseCase.execute.mockResolvedValue(mockClient);
      
      //TODO: Act
      await clientController.getById(req, res);
      
      //TODO: Assert
      expect(mockGetClientUseCase.execute).toBeCalledWith('123');
      
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockClient);
    });
    
    it('deve propagar erro quando cliente não for encontrado', async () => {
      //TODO: Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.params.id = '999';
      
      mockGetClientUseCase.execute.mockRejectedValue(new NotFoundError('Cliente'));
      
      //TODO: Act
      await expect(clientController.getById(req, res)).rejects.toThrow(NotFoundError);
    });
  });
  
  describe('getAll', () => {
    it('deve listar todos os clientes com sucesso e retornar 200', async () => {
      //TODO: Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      const mockClients = [
        {
          id: '123',
          name: 'Cliente 1',
          email: 'cliente1@example.com',
          phone: '11999887733',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '456',
          name: 'Cliente 2',
          email: 'cliente2@example.com',
          phone: '11999887722',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockListClientsUseCase.execute.mockResolvedValue(mockClients);
      
      //TODO: Act
      await clientController.getAll(req, res);
      
      //TODO: Assert
      expect(mockListClientsUseCase.execute).toBeCalled();
      
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockClients);
    });
  });
});
