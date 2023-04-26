import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { dbConfig } from './common/config';
import { LoggerMiddleware } from './common/logger/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
