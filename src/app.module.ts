/**
 * App module.
 * @file App 主模块
 * @module app/module
 */

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import cookieSession = require('cookie-session');

// 拦截器
import { HttpCacheInterceptor } from '@app/interceptors/cache.interceptor';

// 中间件
import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';

// 公共模块
// import { DatabaseModule } from '@app/processors/database/database.module';
import { CacheModule } from '@app/processors/cache/cache.module';
import { EventBusModule } from '@app/modules/event-bus/event-bus.module';
import { HelperModule } from '@app/processors/helper/helper.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// 业务模块（核心）
import { AuthModule } from '@app/modules/auth/auth.module';
import { OptionModule } from '@app/modules/options/option.module';
import { UserModule } from '@app/modules/users/user.module';
import { PostModule } from '@app/modules/posts/post.module';
// import { AnnouncementModule } from '@app/modules/announcement/announcement.module';
// import { TagModule } from '@app/modules/tag/tag.module';
// import { CategoryModule } from '@app/modules/category/category.module';
// import { ArticleModule } from '@app/modules/article/article.module';
// import { CommentModule } from '@app/modules/comment/comment.module';
// import { LikeModule } from '@app/modules/like/like.module';

import * as APP_CONFIG from '@app/app.config';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { CategoriesModule } from '@app/modules/categories/categories.module';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { TermModule } from '@app/modules/terms/term.module';
import { TagModule } from '@app/modules/tags/tag.module';
import { JobModule } from '@app/modules/jobs/job.module';
import { InternalModule } from '@app/modules/internal/internal.module';
import { ConfigModule } from '@app/modules/config/config.module';
import { RequestContextService } from '@app/common/request-context.service';
import { AnnouncementModule } from '@app/modules/announcement/anouncement.module';
import { BullModule } from 'nest-bull';
import { DoneCallback, Job } from 'bull';
import { ACLGuard } from '@app/guards/acl.guard';
import { getMetadataArgsStorage } from 'typeorm';
const QueueModule = BullModule.forRoot({
  name: 'jobStore',
  options: {
    redis: {
      host: 'redis',
      port: 6379,
    },
  },
  processors: [
    (job: Job, done: DoneCallback) => {
      done(null, done(null, job.data));
    },
  ],
});
@Module({
  imports: [
    QueueModule,
    HelperModule,
    EventBusModule,
    // DatabaseModule,
    ConfigModule,
    CacheModule,
    // 工作任务队列模块
    JobModule,
    InternalModule,
    // 权限模块
    AuthModule,
    // 用户模块
    UserModule,
    // 配置项模块
    OptionModule,
    // 内部用：分类法管理模块
    TermModule,
    // 类别管理模块
    CategoriesModule,
    // 标签管理模块
    TagModule,
    // 文章内容发布模块
    PostModule,
    // 公告模块
    AnnouncementModule,
    // CategoryModule,
    // ArticleModule,
    // CommentModule,
    // LikeModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'abcd1234',
      database: 'picker',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    RequestContextService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ACLGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
