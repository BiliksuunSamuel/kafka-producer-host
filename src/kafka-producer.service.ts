import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import { KAFKA_PRODUCER_OPTIONS } from "./constants/kafka.constants";
import { KafkaProducerConfig } from "./interface/kafka-producer-config.interface";

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaProducerService.name);
  private producer: Producer;
  private retries: number;
  private retryDelay: number;

  constructor(
    @Inject(KAFKA_PRODUCER_OPTIONS)
    private readonly config: KafkaProducerConfig
  ) {
    const kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: Array.isArray(this.config.bootstrapServer)
        ? this.config.bootstrapServer
        : [this.config.bootstrapServer],
    });

    this.producer = kafka.producer();

    // Set retry config with defaults
    this.retries = config.retryOptions?.retries ?? 3;
    this.retryDelay = config.retryOptions?.retryDelay ?? 1000; // 1 second
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log("✅ Kafka producer connected");
  }

  async produceAsync(
    topic: string,
    value: any,
    options: {
      key?: string;
      headers?: Record<string, string>;
      partition?: number;
    }
  ): Promise<void> {
    const { key, headers, partition } = options;

    const payload = {
      topic,
      messages: [
        {
          key,
          value: typeof value === "string" ? value : JSON.stringify(value),
          headers,
          partition,
        },
      ],
    };

    let attempt = 0;
    let lastError: any = null;

    while (attempt <= this.retries) {
      try {
        this.logger.log(
          `🚀 Sending message to topic: ${topic} (Attempt ${attempt + 1})`
        );
        await this.producer.send(payload);
        this.logger.log(`✅ Message successfully sent to topic: ${topic}`);
        return; // ✅ Success
      } catch (error: any) {
        lastError = error;
        this.logger.error(
          `Failed to send message (Attempt ${attempt + 1}): ${error?.message}`
        );

        if (attempt < this.retries) {
          this.logger.log(`🔄 Retrying in ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
        }
      }
      attempt++;
    }

    // After retries exhausted
    this.logger.error(
      `Failed to send message after ${this.retries + 1} attempts.`
    );
    throw lastError;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
