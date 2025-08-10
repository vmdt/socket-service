// rabbitmq.module.ts
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";

@Module({
    providers: [
        {
            provide: 'RABBITMQ_CONNECTION',
            useFactory: async (configService: ConfigService) => {
                const host = configService.get<string>('RABBITMQ_HOST') || 'localhost';
                const port = configService.get<string>('RABBITMQ_PORT') || '5672';
                const user = configService.get<string>('RABBITMQ_USER') || 'admin';
                const pass = configService.get<string>('RABBITMQ_PASSWORD') || 'password';
                const vhost = configService.get<string>('RABBITMQ_VHOST') || '/';

                const connection = await amqp.connect({
                    protocol: 'amqp',
                    hostname: host,
                    port: parseInt(port, 10),
                    username: user,
                    password: pass,
                    vhost: vhost,
                });

                return connection;
            },
            inject: [ConfigService],
        }
    ],
    exports: ['RABBITMQ_CONNECTION'],
})
export class RabbitMQModule {}
