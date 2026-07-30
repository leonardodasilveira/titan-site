// PRIMEIRO import, de propósito: carrega o .env antes de qualquer módulo que
// leia variáveis de ambiente (o PrismaClient lê DATABASE_URL na construção).
import './load-env';

import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Necessário para ler o cookie de sessão. Sem isso req.cookies é undefined e
  // todo request parece deslogado.
  app.use(cookieParser());

  // 3001, e não o 3000 padrão do Nest: o Next já ocupa a 3000 e o
  // `pnpm dev` sobe os dois juntos.
  const port = process.env.API_PORT ?? 3001;

  // `credentials: true` é necessário para o cookie de sessão do Battle.net
  // atravessar do front para a API em dev (origens diferentes). Ver TIT-18.
  app.enableCors({
    origin: process.env.WEB_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(port);
  console.log(`API ouvindo em http://localhost:${port}`);
}
void bootstrap();
