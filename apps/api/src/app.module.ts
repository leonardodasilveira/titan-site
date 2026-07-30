import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlizzardModule } from './blizzard/blizzard.module';
import { HealthModule } from './health/health.module';
import { InternalModule } from './internal/internal.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, BlizzardModule, AuthModule, InternalModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
