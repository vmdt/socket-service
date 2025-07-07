import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class BattleshipService {
    async joinRoom(@ConnectedSocket() client: Socket, roomId: string) {
        const room = client.nsp.adapter.rooms.get(roomId);
        if (room && room.size >= 2) {
            client.emit('room_full', { message: 'Room is full' });
            return;
        }

        if (room && room.size === 1) {
            client.join(roomId);
            client.emit('room:another_join', { message: 'Joined room successfully' });
        }
        client.join(roomId);
    }
}
