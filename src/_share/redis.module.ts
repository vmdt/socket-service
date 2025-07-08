import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (configService: ConfigService) => {
                return new Redis({
                    host: configService.get('REDIS_HOST') || 'localhost',
                    port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
                    password: configService.get('REDIS_PASSWORD') || undefined,
                });
            },
            inject: [ConfigService],
        }
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule {}