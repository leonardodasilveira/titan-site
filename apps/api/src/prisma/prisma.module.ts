import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global para os repositories de qualquer módulo injetarem sem reimportar.
 *
 * Ser global vale para infraestrutura, não para domínio: módulos de negócio
 * seguem sendo importados explicitamente.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
