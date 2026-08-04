import { Module } from '@nestjs/common';
import { WarcraftLogsModule } from '../warcraftlogs/warcraftlogs.module';
import { WowAuditModule } from '../wowaudit/wowaudit.module';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';

/**
 * Ingestão de presença de raid.
 *
 * Sem controller ainda, de propósito: a Regra 7 manda gravar antes de exibir, e
 * a tela vem com o gate de visibilidade (oficial vê tudo, membro vê só o
 * próprio histórico), que é decisão própria e não é implicada por gravar.
 */
@Module({
  imports: [WowAuditModule, WarcraftLogsModule],
  providers: [AttendanceService, AttendanceRepository],
  exports: [AttendanceService],
})
export class AttendanceModule {}
