import { Inject, Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket } from 'socket.io';

@Injectable()
export class BattleshipService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis
    ) {}

    async playerJoinRoom(@ConnectedSocket() client: Socket, roomId: string, playerId: string) {
        const room = client.nsp.adapter.rooms.get(roomId);
        if (room && room.size >= 2) {
            client.emit('room:full', { message: 'Room is full' });
            return;
        }
        client.join(roomId);
        client.emit('room:joined', { roomId, playerId });
    }
}
