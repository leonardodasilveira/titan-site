import { Controller, Get } from '@nestjs/common';
import type { Health } from '@titan/shared';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): Health {
    return this.healthService.check();
  }
}
