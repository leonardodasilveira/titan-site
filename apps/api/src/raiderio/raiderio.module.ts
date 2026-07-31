import { Module } from '@nestjs/common';
import { RaiderIoService } from './raiderio.service';

@Module({
  providers: [RaiderIoService],
  exports: [RaiderIoService],
})
export class RaiderIoModule {}
