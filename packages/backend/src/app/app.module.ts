import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import cors from 'cors';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PostsModule } from '../posts/posts.module';
import { PostsController } from '../posts/posts.controller';

@Module({
  imports: [UsersModule, PostsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply cors() middleware first, if needed
    consumer.apply(cors());

    consumer.apply(AuthMiddleware).forRoutes({
      path: 'users',
      method: RequestMethod.GET,
    });

    consumer.apply(AuthMiddleware).forRoutes(PostsController);
  }
}
