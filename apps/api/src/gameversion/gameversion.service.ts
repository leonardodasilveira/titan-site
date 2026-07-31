import { Injectable, Logger } from '@nestjs/common';

/** TTL longo: patch muda poucas vezes por ano. */
const TTL_MS = 6 * 60 * 60 * 1000;

/**
 * Versão viva do WoW, para rotular a season de um jeito que jogador reconhece.
 *
 * "Season 17" não diz nada; "12.0" diz. A gramática: **12** é a expansão
 * (Midnight) e o **.1** é season nova, com raid nova.
 *
 * ATENÇÃO — este valor é **só rótulo de exibição**:
 *
 * - a fonte não é API documentada, é o servidor que o cliente do jogo consulta
 *   para descobrir build. Estável na prática, sem contrato público;
 * - responde **só em HTTP**, sem TLS.
 *
 * Por isso ele **nunca decide nada**: não marca virada de season, não corta
 * relatório, não dá permissão. Quem responde "a season virou?" é o id da season
 * na Game Data API. Minor version nem serviria: a 12.0.7 foi patch de conteúdo
 * e não abriu season nenhuma.
 *
 * Falhar aqui é aceitável — o rótulo fica nulo e o resto do snapshot continua.
 */
@Injectable()
export class GameVersionService {
  private readonly logger = new Logger(GameVersionService.name);
  private static readonly URL = 'http://us.patch.battle.net:1119/wow/versions';

  private cache: { patch: string | null; fetchedAt: number } | null = null;

  /** Rótulo `major.minor` ("12.0"), ou null se não der para descobrir. */
  async getPatchLabel(): Promise<string | null> {
    if (this.cache && Date.now() - this.cache.fetchedAt < TTL_MS) return this.cache.patch;

    const patch = await this.fetchPatchLabel();
    this.cache = { patch, fetchedAt: Date.now() };
    return patch;
  }

  private async fetchPatchLabel(): Promise<string | null> {
    try {
      const res = await fetch(GameVersionService.URL, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) {
        this.logger.warn(`Servidor de patch devolveu HTTP ${res.status}; season fica sem rótulo`);
        return null;
      }

      // Formato: linhas separadas por |, com cabeçalho e uma linha "## seqn".
      // Region|BuildConfig|CDNConfig|KeyRing|BuildId|VersionsName|ProductConfig
      const texto = await res.text();
      const linha = texto.split(/\r?\n/).find((l) => l.startsWith('us|'));
      if (!linha) return null;

      const versionsName = linha.split('|')[5];
      if (!versionsName) return null;

      // "12.0.7.68887" -> "12.0". A guilda fala em major.minor.
      const partes = versionsName.split('.');
      if (partes.length < 2) return null;

      return `${partes[0]}.${partes[1]}`;
    } catch (err: unknown) {
      const motivo = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Não foi possível ler a versão do jogo (${motivo}); season fica sem rótulo`);
      return null;
    }
  }
}
