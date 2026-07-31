import { Module } from '@nestjs/common';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { GameVersionModule } from '../gameversion/gameversion.module';
import { RaiderIoModule } from '../raiderio/raiderio.module';
import { WowAuditModule } from '../wowaudit/wowaudit.module';
import { SnapshotsRepository } from './snapshots.repository';
import { SnapshotsService } from './snapshots.service';

/**
 * Sem controller: o gatilho é o cron, não HTTP. Esta issue é só gravação — a
 * leitura vem depois, quando houver semanas para comparar.
 */
@Module({
  imports: [BlizzardModule, WowAuditModule, RaiderIoModule, GameVersionModule],
  providers: [SnapshotsService, SnapshotsRepository],
  exports: [SnapshotsService],
})
export class SnapshotsModule {}
