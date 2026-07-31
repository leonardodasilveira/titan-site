import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { ProgressReport } from '@titan/shared';
import { MemberGuard } from '../auth/session.guard';
import { ProgressService } from './progress.service';

/**
 * Relatório de progressão. Área interna, então guard próprio — Regra 5.
 *
 * Devolve `null` quando ainda não há semana gravada: é estado esperado no
 * começo, não erro.
 */
@Controller('internal/progress')
@UseGuards(MemberGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get()
  getReport(@Query('season') season?: string): Promise<ProgressReport | null> {
    // Query param vem como string; só passa adiante se for número de verdade.
    const id = season && /^\d+$/.test(season) ? Number(season) : undefined;
    return this.progress.getReport(id);
  }
}
