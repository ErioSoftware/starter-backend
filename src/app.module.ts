import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { LoaderModule } from './common/loader/loader.module';
import { DrizzleModule } from './common/database/drizzle.module';
@Module({
  imports: [EventEmitterModule.forRoot(), LoaderModule, DrizzleModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
