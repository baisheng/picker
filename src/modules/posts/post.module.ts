/**
 * Posts module.
 * @file 内容模块
 * @module module/posts/module
 */

import { Module } from '@nestjs/common';
import { PostController } from '@app/modules/posts/post.controller';
import { PostService } from '@app/modules/posts/post.service';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { OptionService } from '@app/modules/options/option.service';
import { UserService } from '@app/modules/users/user.service';
import { TermService } from '@app/modules/terms/term.service';
import { PostsService } from '@app/modules/posts/posts.service';
import { PostsController } from '@app/modules/posts/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/modules/users/user.entity';
import { PostEntity } from '@app/modules/posts/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController, PostsController],
  providers: [PostService, PostsService, TermService, CategoriesService, OptionService, UserService],
  exports: [PostService],
})
export class PostModule {}
