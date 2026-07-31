import { Module } from '@nestjs/common';
import { WowAuditService } from './wowaudit.service';

@Module({
  providers: [WowAuditService],
  exports: [WowAuditService],
})
export class WowAuditModule {}
