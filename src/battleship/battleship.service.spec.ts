import { Test, TestingModule } from '@nestjs/testing';
import { BattleshipService } from './battleship.service';

describe('BattleshipService', () => {
  let service: BattleshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleshipService],
    }).compile();

    service = module.get<BattleshipService>(BattleshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
