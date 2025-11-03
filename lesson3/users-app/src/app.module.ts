import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './shared/config/config.module';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [UsersModule, ConfigModule, LoggerModule.forRoot('debug')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
