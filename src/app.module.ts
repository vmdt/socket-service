import { Module } from '@nestjs/common';
import { BattleshipModule } from './battleship/battleship.module';
import { UserModule } from './user/user.module';
import { ShareModule } from './_share/_share.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    BattleshipModule, 
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
