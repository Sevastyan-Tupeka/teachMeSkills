import { Inject, Injectable } from '@nestjs/common';
import { LoggerLevel } from './logger.entity';

@Injectable()
export class LoggerService {
  constructor(
    @Inject('APP_CONFIG') private readonly config: any,
    @Inject('LOGGER_LEVEL') private readonly level: keyof typeof LoggerLevel,
  ) {}

  log(msg: string) {
    if (this.config.debug === true) {
      console.log(`[${this.level.toUpperCase()}] ${msg}`);
    } else {
      return false;
    }
  }
}
