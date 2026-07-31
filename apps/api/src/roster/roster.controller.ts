import { Controller, Get, UseGuards } from '@nestjs/common';
import type { Roster } from '@titan/shared';
import { MemberGuard } from '../auth/session.guard';
import { RosterService } from './roster.service';

/**
 * Roster do time de raid. Área interna, então guard próprio — Regra 5.
 *
 * O teste não é "a UI esconde?" e sim "chamado sem cookie devolve 401?".
 */
@Controller('internal/roster')
@UseGuards(MemberGuard)
export class RosterController {
  constructor(private readonly roster: RosterService) {}

  @Get()
  getRaidTeam(): Promise<Roster> {
    return this.roster.getRaidTeam();
  }
}
