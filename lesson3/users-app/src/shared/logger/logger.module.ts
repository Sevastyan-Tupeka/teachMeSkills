import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerLevel } from './logger.entity';
import { ConfigModule } from '../config/config.module';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(level: keyof LoggerLevel): DynamicModule {
    return {
      imports: [ConfigModule],
      module: LoggerModule,
      providers: [{ provide: 'LOGGER_LEVEL', useValue: level }, LoggerService],
      exports: [LoggerService],
    };
  }
}
