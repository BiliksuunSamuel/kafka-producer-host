# 📦 kafka-producer-host

A **NestJS module** that provides a plug-and-play Kafka producer setup, making it easy to **send Kafka messages** with **built-in retry logic** and full support for **NestJS dependency injection.**

## 📦 Installation

```bash
npm install kafka-producer-host
```

`or`

```bash
yarn add kafka-producer-host
```

## ⚙️ Usage

### 1️⃣ Register the producer module in your AppModule

```ts
import { Module } from "@nestjs/common";
import { KafkaProducerHostModule } from "kafka-producer-host";
import { AppService } from "./app.service";

@Module({
  imports: [
    KafkaProducerHostModule.register({
      bootstrapServer: "localhost:9092",
      clientId: "my-producer-client",
      retryOptions: {
        retries: 5,
        retryDelay: 2000, // Optional, in milliseconds (default: 1000ms)
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
```

### 2️⃣ Use the producer service to send messages

```ts
import { Injectable } from "@nestjs/common";
import { KafkaProducerService } from "kafka-producer-host";

@Injectable()
export class AppService {
  constructor(private readonly producerService: KafkaProducerService) {}

  /*

  topic:string,
  value:any,
  options?:any

  */
  async sendMessage() {
    await this.producerService.produceAsync(
      "order-created",
      {
        id: 123,
        status: "created",
      },
      {
        key: "order-123",
      }
    );
  }
}
```
