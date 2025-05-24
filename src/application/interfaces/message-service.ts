export interface MessageProducer {
  publish<T>(topic: string, message: T, routingKey?: string): Promise<void>;
}

export interface MessageConsumer {
  subscribe<T>(queue: string, callback: (message: T) => Promise<void>): Promise<void>;
}
