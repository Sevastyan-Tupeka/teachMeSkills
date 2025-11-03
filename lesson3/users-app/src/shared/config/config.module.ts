import { Module } from '@nestjs/common';

@Module({
  providers: [{ provide: 'APP_CONFIG', useValue: { debug: true } }],
  exports: ['APP_CONFIG'],
})
export class ConfigModule {}
