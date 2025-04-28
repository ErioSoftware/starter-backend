import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { LoaderModule } from './common/loader/loader.module';
import { DrizzleModule } from './common/database/drizzle.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClsModule } from 'nestjs-cls';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoaderModule,
    DrizzleModule,
    PostModule,
    UserModule,
    AuthModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
