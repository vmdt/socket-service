import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ShareModule } from 'src/_share/_share.module';
import { ConfigModule } from '@nestjs/config';
import { BattleshipModule } from 'src/battleship/battleship.module';

@Module({
  imports: [ShareModule, ConfigModule, BattleshipModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
