import { DynamicModule, Module, Provider } from "@nestjs/common";
import { KafkaProducerService } from "./kafka-producer.service";
import { KAFKA_PRODUCER_OPTIONS } from "./constants/kafka.constants";
import { KafkaProducerConfig } from "./interface/kafka-producer-config.interface";

@Module({})
export class KafkaProducerHostModule {
  static register(config: KafkaProducerConfig): DynamicModule {
    const configProvider: Provider = {
      provide: KAFKA_PRODUCER_OPTIONS,
      useValue: config,
    };

    return {
      module: KafkaProducerHostModule,
      providers: [KafkaProducerService, configProvider],
      exports: [KafkaProducerService],
    };
  }
}
