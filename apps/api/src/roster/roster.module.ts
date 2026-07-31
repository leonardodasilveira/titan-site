import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RaiderIoModule } from '../raiderio/raiderio.module';
import { WowAuditModule } from '../wowaudit/wowaudit.module';
import { RosterController } from './roster.controller';
import { RosterService } from './roster.service';

/**
 * Sem repository: este módulo não toca o banco. O roster do time vive no
 * WoWAudit, e persistir uma cópia aqui só criaria uma segunda verdade para
 * sair de sincronia.
 */
@Module({
  imports: [AuthModule, WowAuditModule, RaiderIoModule],
  controllers: [RosterController],
  providers: [RosterService],
})
export class RosterModule {}
