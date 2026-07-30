import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Client do Prisma como provider do Nest.
 *
 * Só repositories devem injetar isto — ver Regra 3 do CLAUDE.md. Nenhum service
 * de domínio importa PrismaClient direto.
 *
 * A partir do Prisma 7, o client exige um driver adapter no construtor; a
 * connection string não vem mais do schema.prisma. O `prisma.config.ts` cobre
 * só o CLI (migrate, generate) — o runtime é aqui.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      // Falha explícita: sem isso o Prisma dá um erro de adapter que não
      // aponta para a causa real, que é .env não carregado. Ver load-env.ts.
      throw new Error(
        'DATABASE_URL não está definida. Confira o .env na raiz do repositório (ver .env.example).',
      );
    }

    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Conectado ao banco');
    } catch (error) {
      // Falhar alto: banco fora do ar não pode virar erro obscuro no primeiro
      // request. Em dev, a causa quase sempre é o container parado.
      this.logger.error(
        'Não foi possível conectar ao banco. Em dev, verifique: pnpm db:status',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
