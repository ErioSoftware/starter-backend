import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './common/auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { dbConfig } from './common/config';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/auth/jwt/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
  ],
  providers: [
    //uncomment this to require auth everywhere
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
