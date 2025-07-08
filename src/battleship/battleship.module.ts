import { Module } from '@nestjs/common';
import { BattleshipGateway } from './battleship.gateway';
import { BattleshipService } from './battleship.service';
import { ShareModule } from 'src/_share/_share.module';

@Module({
  imports: [ShareModule],
  providers: [BattleshipGateway, BattleshipService]
})
export class BattleshipModule {}
