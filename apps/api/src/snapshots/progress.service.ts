import { Injectable, NotFoundException } from '@nestjs/common';
import type { ProgressReport, ProgressRow, SeasonOption } from '@titan/shared';
import { SnapshotsRepository } from './snapshots.repository';

/** Quantas seasons aparecem no seletor. */
const SEASONS_NO_SELETOR = 6;

/** Média que ignora ausência — sem dado não é zero. Null se ninguém tem. */
function media(valores: Array<number | null>): number | null {
  const presentes = valores.filter((v): v is number => v !== null);
  if (presentes.length === 0) return null;
  return presentes.reduce((a, b) => a + b, 0) / presentes.length;
}

/** Diferença que só existe quando os dois lados existem. */
function delta(a: number | null, b: number | null): number | null {
  return a === null || b === null ? null : a - b;
}

/**
 * Relatório de progressão da season.
 *
 * Lê o que o job de snapshot gravou. Não chama API externa nenhuma — é o
 * pagamento do que foi guardado semana a semana.
 */
@Injectable()
export class ProgressService {
  constructor(private readonly repo: SnapshotsRepository) {}

  /**
   * @param seasonId season pedida; sem ela, a mais recente gravada.
   */
  async getReport(seasonId?: number): Promise<ProgressReport | null> {
    const seasons = await this.repo.listSeasons(SEASONS_NO_SELETOR);
    if (seasons.length === 0) return null;

    const escolhida = seasonId ? await this.repo.findSeason(seasonId) : (seasons[0] ?? null);

    if (!escolhida) throw new NotFoundException(`Season ${seasonId} não foi gravada`);

    const snapshots = await this.repo.findSeasonSnapshots(escolhida.id);
    if (snapshots.length === 0) return null;

    const periods = [...new Set(snapshots.map((s) => s.period))].sort((a, b) => a - b);
    const atual = periods[periods.length - 1];
    const anterior = periods.length > 1 ? periods[periods.length - 2] : null;

    if (atual === undefined) return null;

    const daSemana = snapshots.filter((s) => s.period === atual);

    // Média do time na semana. É o que o raid leader compara contra cada um.
    const average = {
      itemLevel: media(daSemana.map((s) => s.itemLevel)),
      keysDone: media(daSemana.map((s) => s.keysDone)),
    };

    const rows: ProgressRow[] = daSemana.map((s) => {
      const antes = anterior
        ? (snapshots.find(
            (o) => o.period === anterior && o.nameKey === s.nameKey && o.realmSlug === s.realmSlug,
          ) ?? null)
        : null;

      // Acumulado só das semanas com registro — e quantas são, porque o total
      // sozinho engana: baixo pode ser "fez pouco" ou "não tínhamos o dado".
      const daPessoa = snapshots.filter(
        (o) => o.nameKey === s.nameKey && o.realmSlug === s.realmSlug,
      );
      const comRegistro = daPessoa.filter((o) => o.keysDone !== null);
      const keysInSeason = comRegistro.reduce((total, o) => total + (o.keysDone ?? 0), 0);

      return {
        name: s.name,
        realm: s.realmSlug,
        itemLevel: s.itemLevel,
        itemLevelDelta: delta(s.itemLevel, antes?.itemLevel ?? null),
        itemLevelVsAverage: delta(s.itemLevel, average.itemLevel),
        keysDone: s.keysDone,
        keysVsAverage: delta(s.keysDone, average.keysDone),
        keysInSeason,
        keysWeeksKnown: comRegistro.length,
        highestKey: s.highestKey,
      };
    });

    const opcao = (s: (typeof seasons)[number]): SeasonOption => ({
      id: s.id,
      patch: s.patch,
      name: s.name,
    });

    return {
      season: opcao(escolhida),
      availableSeasons: seasons.map(opcao),
      period: atual,
      weekInSeason: atual - escolhida.firstPeriod + 1,
      periodCount: escolhida.periodCount,
      average,
      rows,
    };
  }
}
