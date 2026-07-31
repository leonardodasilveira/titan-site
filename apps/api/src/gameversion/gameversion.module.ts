import { Module } from '@nestjs/common';
import { GameVersionService } from './gameversion.service';

@Module({
  providers: [GameVersionService],
  exports: [GameVersionService],
})
export class GameVersionModule {}
