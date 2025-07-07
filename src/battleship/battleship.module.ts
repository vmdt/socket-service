import { Module } from '@nestjs/common';
import { BattleshipGateway } from './battleship.gateway';
import { BattleshipService } from './battleship.service';

@Module({
  providers: [BattleshipGateway, BattleshipService]
})
export class BattleshipModule {}
