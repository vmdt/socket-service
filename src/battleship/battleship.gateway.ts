import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BattleshipService } from './battleship.service';
import { Socket } from 'socket.io';

@WebSocketGateway({namespace: 'battleship', cors: true})
export class BattleshipGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly service: BattleshipService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('room:join')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    console.log(`Client ${client.id} joining room: ${data.roomId}`);
    this.service.joinRoom(client, data.roomId);
  }
}
