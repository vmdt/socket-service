import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class UserService {
    subscribeUser(@ConnectedSocket() client: Socket, userId: string) {
        client.join(`user:${userId}`);
    }
}
