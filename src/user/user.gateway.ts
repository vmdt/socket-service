import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';

@WebSocketGateway({ namespace: 'user', cors: true })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`User connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
  }

  @SubscribeMessage('user:subscribe')
  handleUserSubscribe(@ConnectedSocket() client: Socket, data: { userId: string }) {
    this.userService.subscribeUser(client, data.userId);
  }
}
