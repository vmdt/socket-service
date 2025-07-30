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
    await sub.subscribe('battleship_events');
    sub.on('message', (channel, message) => {
      const eventData = JSON.parse(message) as {
        event: string;
        room_id?: string;
        player_id?: string;
        [key: string]: any;
      };
      if (channel === 'room_events') {
        if (eventData?.event == 'room:started' || eventData?.event == 'room:update_options') {
          this.server.to(eventData?.room_id || 'user:test').emit(eventData.event, eventData);
        } else {
          this.server.to(`user:test`).emit(eventData.event, eventData);
        }
      }


      if (channel === 'battleship_events') {
        switch (eventData?.event) {
          case "battleship:attack":
            console.log(`Battleship attack event received for room: ${eventData.room_id}`);
            this.server.to(eventData?.room_id || 'user:test').emit(eventData.event, eventData);
            break;
        }
      }
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.server.to(`user:test`).emit('user:reconnected', { clientId: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.to(`user:test`).emit('user:disconnected', { clientId: client.id });
  }

  @SubscribeMessage('room:join')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomId: string }) {
    client.join(payload.roomId);
    console.log(`Client ${client.id} joined room ${payload.roomId}`);
  }
}
