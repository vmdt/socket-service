import { Inject, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Channel } from 'amqplib';
import { BattleshipGateway } from 'src/battleship/battleship.gateway';

@Injectable()
export class ChatService implements OnModuleInit, OnModuleDestroy {
    private channel: Channel;
    private readonly logger = new Logger(ChatService.name);

    constructor(
        @Inject('RABBITMQ_CONNECTION') private readonly rabbitConnection: Connection,
        private readonly configService: ConfigService,
        private readonly battleshipGateway: BattleshipGateway
    ) {}

    async onModuleInit() {
        this.channel = await this.rabbitConnection.createChannel();

        const exchangeName = this.configService.get<string>('RABBITMQ_EXCHANGE') || 'chat_battleship';
        const exchangeType = this.configService.get<string>('RABBITMQ_EXCHANGE_TYPE') || 'direct';
        const routingKey = this.configService.get<string>('RABBITMQ_ROUTING_KEY') || 'chatkey';
        const queueName = this.configService.get<string>('RABBITMQ_QUEUE') || 'chat_queue';

        await this.channel.assertExchange(exchangeName, exchangeType, { durable: true });
        await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.bindQueue(queueName, exchangeName, routingKey);

        this.logger.log(`Listening on queue "${queueName}" from exchange "${exchangeName}" with key "${routingKey}"`);
        await this.channel.consume(queueName, (msg) => {
            if (msg) {
                try {
                    const content = msg.content.toString();
                    const data = JSON.parse(content);
                    
                    this.sendMessage(data);

                    this.channel.ack(msg);
                } catch (err) {
                    this.logger.error(`Error: ${err.message}`);
                    this.channel.nack(msg, false, false);
                }
            }
        });
    }

    async onModuleDestroy() {
        await this.channel.close();
        await this.rabbitConnection.close();
    }

    public sendMessage(message: {
        sender_id: string;
        room_id: string;
        content: string;
        is_log?: boolean;
    }) {
        this.battleshipGateway.server.to(message.room_id).emit('room:chat', message);
    }
}
