import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BattleshipService } from './battleship.service';
import { Server, Socket } from 'socket.io';
import { Inject, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@WebSocketGateway({namespace: 'battleship', cors: true})
export class BattleshipGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(
    private readonly service: BattleshipService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

  async onModuleInit() {
    const sub = this.redisClient.duplicate();
    if (sub.status !== 'ready' && sub.status !== 'connecting') {
      await sub.connect();
    }
    await sub.subscribe('room_events');
    sub.on('message', (channel, message) => {
      if (channel === 'room_events') {
        const eventData = JSON.parse(message);
        console.log(`Received event on channel ${channel}:`, eventData);
        this.server.to(eventData.roomId).emit(eventData.event, eventData.data);
      }
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
