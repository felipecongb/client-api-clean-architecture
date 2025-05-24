# Detalhes da Arquitetura

A arquitetura do projeto foi projetada para ser modular, escalável e fácil de manter, seguindo os princípios da Clean Architecture e SOLID. Aqui estão mais detalhes sobre cada camada:

## Domain (Domínio)

- **Responsabilidade:**
  - Define as regras de negócio fundamentais e as entidades principais do sistema.
  - Contém interfaces que abstraem os repositórios e serviços externos.

- **Exemplo:**
  - A entidade `Client` representa um cliente com propriedades como `name`, `email` e `phone`.

## Application (Aplicação)

- **Responsabilidade:**
  - Implementa os casos de uso que orquestram as regras de negócio e interagem com as interfaces do domínio.
  - Não depende de frameworks ou bibliotecas externas.

- **Exemplo:**
  - O caso de uso `CreateClientUseCase` valida os dados de entrada, cria um cliente e o salva no repositório.

## Infrastructure (Infraestrutura)

- **Responsabilidade:**
  - Fornece implementações concretas para as interfaces definidas no domínio.
  - Integra-se com tecnologias externas, como MongoDB, Redis e RabbitMQ.

- **Exemplo:**
  - O repositório `MongoClientRepository` implementa a interface `ClientRepository` e interage com o MongoDB.

## Presentation (Apresentação)

- **Responsabilidade:**
  - Lida com a entrada e saída de dados, como requisições HTTP e respostas JSON.
  - Contém controladores e middlewares para validação e tratamento de erros.

- **Exemplo:**
  - O controlador `ClientController` expõe endpoints para criar, atualizar e consultar clientes.

## Main (Principal)

- **Responsabilidade:**
  - Configura e inicializa a aplicação.
  - Realiza a injeção de dependências e configurações globais.

- **Exemplo:**
  - O arquivo `setup.ts` inicializa serviços como MongoDB, Redis e RabbitMQ, além de configurar filas e exchanges.

## Fluxo de Dados

1. **Requisição HTTP:**

   - Um cliente faz uma requisição para um endpoint da API.

2. **Validação:**

   - A requisição é validada por middlewares na camada de apresentação.

3. **Caso de Uso:**

   - O controlador chama um caso de uso na camada de aplicação.

4. **Repositório:**

   - O caso de uso interage com a camada de infraestrutura para acessar o banco de dados ou outros serviços.

5. **Resposta:**

   - O resultado é retornado ao cliente como uma resposta HTTP.

Essa separação clara de responsabilidades facilita a manutenção, testes e evolução do sistema.
