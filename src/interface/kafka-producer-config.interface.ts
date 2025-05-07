import { KafkaConfig, Mechanism, SASLOptions } from "kafkajs";

export interface KafkaProducerConfig
  extends Omit<
    KafkaConfig,
    "ssl" | "sasl" | "brokers" | "clientId" | "offsetReset" | "retryOptions"
  > {
  bootstrapServer: string | string[];
  groupId: string;
  clientId?: string;
  retryOptions?: {
    retries: number;
    retryDelay?: number;
  };
  ssl?: boolean;
  sasl?: SASLOptions | Mechanism | undefined;
}
