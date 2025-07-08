import { Module } from '@nestjs/common';
import { BattleshipModule } from './battleship/battleship.module';
import { UserModule } from './user/user.module';
import { ShareModule } from './_share/_share.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BattleshipModule, 
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
