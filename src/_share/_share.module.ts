import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { RabbitMQModule } from './rabbitmq.module';

@Module({
    imports: [RedisModule, RabbitMQModule],
    exports: [RedisModule, RabbitMQModule],
})
export class ShareModule {}
