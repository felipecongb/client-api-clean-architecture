import { MessageConsumer } from '../../application/interfaces/message-service';

type ClientEventData = {
  event: 'CLIENT_CREATED' | 'CLIENT_UPDATED';
  data: any;
};

export class ClientEventConsumer {
  constructor(private readonly messageConsumer: MessageConsumer) {}

  async start(queueName: string): Promise<void> {
    await this.messageConsumer.subscribe<ClientEventData>(queueName, async (message) => {
      try {
        console.log(`📨 Evento recebido: ${message.event}`);
        console.log('📦 Dados:', JSON.stringify(message.data, null, 2));
        
        //TODO: Aqui poderíamos processar os eventos de diferentes formas
        //TODO: Por exemplo, enviando um email, notificação, ou executando outra lógica de negócio
        
        switch (message.event) {
          case 'CLIENT_CREATED':
            await this.handleClientCreated(message.data);
            break;
          case 'CLIENT_UPDATED':
            await this.handleClientUpdated(message.data);
            break;
          default:
            console.warn(`⚠️ Evento não reconhecido: ${message.event}`);
        }
      } catch (error) {
        console.error('❌ Erro ao processar evento:', error);
      }
    });
  }

  private async handleClientCreated(data: any): Promise<void> {
    //TODO: Aqui poderíamos processar o evento de cliente criado
    //TODO: Por exemplo, enviar um email de boas-vindas
    console.log(`✨ Cliente criado com sucesso: ${data.name} (${data.email})`);
    
    //TODO: Simulando uma operação assíncrona
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async handleClientUpdated(data: any): Promise<void> {
    //TODO: Aqui poderíamos processar o evento de cliente atualizado
    console.log(`✏️ Cliente atualizado com sucesso: ${data.name} (${data.email})`);
    
    //TODO: Simulando uma operação assíncrona
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
