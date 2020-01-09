/**
 * Terms module.
 * @file 分类方法与内容类别应用管理模块
 * @module module/terms/module
 */

import { Module } from '@nestjs/common';
import { TermService } from '@app/modules/terms/term.service';
import { TermController } from '@app/modules/terms/term.controller';

@Module({
  controllers: [TermController],
  providers: [TermService],
  exports: [TermService],
})
export class TermModule {}
