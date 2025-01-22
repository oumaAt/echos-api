import { DynamicModule, Module } from "@nestjs/common";
import { RedisOptions } from "ioredis";

@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions): DynamicModule {
    const RedisClientProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redis = require('redis');
        const client = redis.createClient(options);
        await client.connect();
        return client;
      },
    };

    return {
      module: RedisModule,
      providers: [RedisClientProvider],
      exports: [RedisClientProvider],
    };
  }
}
