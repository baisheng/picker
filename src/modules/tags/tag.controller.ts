import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { TermService } from '@app/modules/terms/term.service';
import { TagDto } from '@app/modules/tags/tag.dto';

@Controller('tags')
export class TagController {
  constructor(
    // private readonly categoriesService: TagService,
    private readonly termService: TermService,
  ) {
  }

  @Get()
  root(): Promise<any> {
    return this.termService.getTermsByTaxonomy('post_tag');
  }

  @Post()
  create(@Body() body: TagDto) {
    // 标签入库，业务方法
    return body;
  }

  // @Get(':taxonomy/:slug')
  // findByTaxonomySlug(@Param('slug') slug: any, @Param('taxonomy') taxonomy: any): Promise<any> {
  // return this.categoriesService.findTermBySlug(taxonomy, slug);
  // }
}
