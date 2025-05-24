import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Clientes',
      version: '1.0.0',
      description: 'API de Clientes seguindo princípios de Clean Architecture',
      contact: {
        name: 'Felipe Consalter'
      }
    },
    components: {
      schemas: {
        Client: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do cliente'
            },
            name: {
              type: 'string',
              description: 'Nome completo do cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente'
            },
            phone: {
              type: 'string',
              description: 'Telefone do cliente'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de última atualização do registro'
            }
          }
        },
        CreateClientRequest: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome completo do cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente'
            },
            phone: {
              type: 'string',
              description: 'Telefone do cliente'
            }
          }
        },
        UpdateClientRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome completo do cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente'
            },
            phone: {
              type: 'string',
              description: 'Telefone do cliente'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Mensagem de erro'
                },
                code: {
                  type: 'string',
                  description: 'Código de erro'
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Clientes',
        description: 'Operações relacionadas a clientes'
      }
    ],
    paths: {
      '/api/v1/clients': {
        get: {
          tags: ['Clientes'],
          summary: 'Lista todos os clientes',
          description: 'Retorna uma lista de todos os clientes cadastrados',
          responses: {
            '200': {
              description: 'Lista de clientes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Client'
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Clientes'],
          summary: 'Cria um novo cliente',
          description: 'Cria um novo cliente no sistema',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateClientRequest'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Cliente criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Client'
                  }
                }
              }
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '409': {
              description: 'Cliente com este e-mail já existe',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/clients/{id}': {
        get: {
          tags: ['Clientes'],
          summary: 'Obtém um cliente por ID',
          description: 'Retorna os detalhes de um cliente específico pelo ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Cliente encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Client'
                  }
                }
              }
            },
            '404': {
              description: 'Cliente não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Clientes'],
          summary: 'Atualiza um cliente',
          description: 'Atualiza os dados de um cliente existente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateClientRequest'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Cliente atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Client'
                  }
                }
              }
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Cliente não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/presentation/controllers/*.ts']
};

export default swaggerJSDoc(options);
