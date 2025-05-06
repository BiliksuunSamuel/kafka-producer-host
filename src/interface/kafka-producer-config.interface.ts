export interface KafkaProducerConfig {
  bootstrapServer: string | string[];
  clientId: string;
  retryOptions?: {
    retries: number;
    retryDelay?: number;
  };
}
