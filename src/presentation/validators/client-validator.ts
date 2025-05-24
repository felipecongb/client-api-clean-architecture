import { z } from 'zod';

//TODO: Schema para validação de cliente
export const createClientSchema = z.object({
  name: z.string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome não pode ter mais de 100 caracteres'),
  email: z.string()
    .email('E-mail inválido')
    .max(100, 'O e-mail não pode ter mais de 100 caracteres'),
  phone: z.string()
    .min(8, 'O telefone deve ter pelo menos 8 caracteres')
    .max(20, 'O telefone não pode ter mais de 20 caracteres')
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientValidated = z.infer<typeof createClientSchema>;
export type UpdateClientValidated = z.infer<typeof updateClientSchema>;
