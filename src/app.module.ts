import { Module } from '@nestjs/common';
import { BattleshipModule } from './battleship/battleship.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [BattleshipModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
