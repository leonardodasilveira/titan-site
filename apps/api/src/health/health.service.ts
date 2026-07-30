import { Injectable } from '@nestjs/common';
import type { Health } from '@titan/shared';

@Injectable()
export class HealthService {
  private readonly startedAt = Date.now();

  check(): Health {
    return {
      status: 'ok',
      service: 'titan-api',
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      timestamp: new Date().toISOString(),
    };
  }
}
