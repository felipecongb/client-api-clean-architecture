export interface CreateClientDto {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ClientDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
