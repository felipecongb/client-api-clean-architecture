import { Request, Response } from 'express';
import { CreateClientUseCase } from '../../application/use-cases/create-client-use-case';
import { GetClientUseCase } from '../../application/use-cases/get-client-use-case';
import { ListClientsUseCase } from '../../application/use-cases/list-clients-use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client-use-case';

export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly getClientUseCase: GetClientUseCase,
    private readonly listClientsUseCase: ListClientsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, phone } = req.body;
    const client = await this.createClientUseCase.execute({ name, email, phone });
    return res.status(201).json(client);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const client = await this.updateClientUseCase.execute(id, { name, email, phone });
    return res.status(200).json(client);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const client = await this.getClientUseCase.execute(id);
    return res.status(200).json(client);
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const clients = await this.listClientsUseCase.execute();
    return res.status(200).json(clients);
  }
}
