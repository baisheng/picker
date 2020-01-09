/**
 * 标签 module.
 * @file 标签管理模块
 * @module module/tags/tag
 */

import { Module } from '@nestjs/common';
import { TagController } from '@app/modules/tags/tag.controller';
import { TagService } from '@app/modules/tags/tag.service';
import { TermService } from '@app/modules/terms/term.service';

@Module({
  controllers: [TagController],
  providers: [TermService],
  exports: [TermService],
})
export class TagModule {}
