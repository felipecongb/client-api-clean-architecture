# API de Clientes

API RESTful para cadastro e consulta de clientes, construída seguindo os princípios de Clean Architecture e SOLID.

## Tecnologias Utilizadas

- **Node.js com TypeScript**: Linguagem de programação
- **Express.js**: Framework web
- **MongoDB**: Banco de dados principal
- **Redis**: Sistema de cache
- **RabbitMQ**: Sistema de mensageria
- **Docker**: Containerização

## Arquitetura do Projeto

Para mais detalhes sobre a arquitetura, consulte o arquivo [ARCHITECTURE.md](./ARCHITECTURE.md).

## Fluxo de Mensagens

Quando um cliente é criado ou atualizado, uma mensagem é publicada em uma exchange do RabbitMQ.
O consumidor processa essa mensagem (neste caso, apenas registra logs, mas poderia realizar outras ações).

## Estrutura do Cache

As consultas de cliente por ID são cacheadas no Redis para melhorar a performance.
O cache é invalidado sempre que um cliente é atualizado.

## Executando o Projeto

### Pré-requisitos

- Docker e Docker Compose

### Passos para Execução

1. Clone o repositório

   ```bash
   git clone https://github.com/felipecongb/client-api-clean-architecture.git
   cd client-api-clean-architecture
   ```

2. Execute o projeto com Docker Compose

   ```bash
   docker-compose up
   ```

3. Para executar em background

   ```bash
   docker-compose up -d
   ```

4. Para parar os containers

   ```bash
   docker-compose down
   ```

## Endpoints da API

### Clientes

- **POST /api/v1/clients**: Criar um novo cliente
  - Body: `{ "name": "string", "email": "string", "phone": "string" }`

- **PUT /api/v1/clients/:id**: Atualizar um cliente existente
  - Body: `{ "name": "string", "email": "string", "phone": "string" }`

- **GET /api/v1/clients/:id**: Obter um cliente por ID

- **GET /api/v1/clients**: Listar todos os clientes

## Testes

Para executar os testes unitários:

```bash
npm test
```

Para executar os testes em modo watch:

```bash
npm run test:unit
```

## Desenvolvimento Local

Para desenvolvimento local sem Docker:

1. Instale as dependências

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`

3. Execute em modo desenvolvimento

   ```bash
   npm run dev
   ```

## Boas Práticas Implementadas

1. **SOLID**:
   - Single Responsibility Principle: Cada classe tem uma única responsabilidade
   - Open/Closed Principle: Entidades extensíveis sem modificação
   - Liskov Substitution Principle: Implementações de interface são substituíveis
   - Interface Segregation Principle: Interfaces específicas para clientes específicos
   - Dependency Inversion Principle: Dependência de abstrações

2. **Clean Architecture**: Separação clara de camadas com dependências apontando para dentro.

3. **Containerização**: Docker para garantir consistência entre ambientes.

4. **Cache**: Redis para melhorar performance em consultas frequentes.

5. **Mensageria**: RabbitMQ para comunicação assíncrona entre serviços.

6. **Testes**: Testes unitários para validar a lógica de negócio.

## Possíveis Melhorias Futuras

1. Adicionar autenticação e autorização
2. Implementar logs estruturados
3. Adicionar rate limiting
4. Melhorar a documentação da API (Swagger/OpenAPI)
5. Implementar integração contínua (CI/CD)
6. Adicionar monitoramento e métricas, Atualmente tem apenas uma rota com status
