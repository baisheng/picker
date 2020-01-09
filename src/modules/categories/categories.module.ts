/**
 * Categories module.
 * @file 类别管理模块
 * @module module/categories/module
 */

import { Module } from '@nestjs/common';
import { CategoriesController } from '@app/modules/categories/categories.controller';
import { CategoriesService } from '@app/modules/categories/categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
