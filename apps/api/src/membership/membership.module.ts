import { Module } from '@nestjs/common';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { MembershipRepository } from './membership.repository';
import { MembershipService } from './membership.service';

/**
 * Revalidação periódica de membership. Sem controller: o gatilho é o cron, não
 * HTTP — um endpoint para forçar a rodada precisaria de gate próprio e não há
 * necessidade ainda.
 */
@Module({
  imports: [BlizzardModule],
  providers: [MembershipService, MembershipRepository],
  exports: [MembershipService],
})
export class MembershipModule {}
