import { Test, TestingModule } from '@nestjs/testing';
import { BattleshipGateway } from './battleship.gateway';

describe('BattleshipGateway', () => {
  let gateway: BattleshipGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleshipGateway],
    }).compile();

    gateway = module.get<BattleshipGateway>(BattleshipGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
