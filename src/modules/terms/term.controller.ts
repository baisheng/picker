import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Allow } from '@app/decorators/allow.decorator';
import { Permission } from '@app/common/generated-types';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { TermTaxonomy } from '@app/modules/terms/term-taxonomy.entity';
import { TermService } from '@app/modules/terms/term.service';
import { Term } from '@app/modules/terms/term.entity';
import { getSlug } from '@app/common/helpers/utils/slug';

// import { CategoriesService } from './categories.service';
// import slug from 'limax';

@Controller('terms')
@Allow(Permission.SuperAdmin)
export class TermController {
  constructor(
    private readonly termService: TermService,
  ) {
  }

  @Get()
  @Allow(Permission.SuperAdmin)
  root(): Promise<any> {
    return this.termService.loadAllTerms(true);
  }

  @Post()
  @HttpProcessor.handle('创建分类类别')
  create(@Body() term: Term): Promise<Term> {
    if (!term.slug) {
      term.slug = getSlug(term.name);
    }
    return this.termService.create(term);
  }

  @Patch()
  @HttpProcessor.handle('批量添加分类类别')
  patchTerms(@Body() terms: Term[]): Promise<Term[]> {
    for (const term of terms) {
      if (!term.slug) {
        term.slug = getSlug(term.name);
      }
    }
    console.log(terms);
    return this.termService.batchCreateTerm(terms);
  }

  @Post('/taxonomy')
  @HttpProcessor.handle('添加内容')
  createTaxonomy(@Body() taxonomy: TermTaxonomy): Promise<TermTaxonomy> {
    return this.termService.createTaxonomy(taxonomy);
  }

  // @Get()
  // root(): Promise<any> {
  // return this.categoriesService.getTermsByTaxonomy('category');
  // }

  // @Get(':taxonomy/:slug')
  // findByTaxonomySlug(@Param('slug') slug: any, @Param('taxonomy') taxonomy: any): Promise<any> {
  // return this.categoriesService.findTermBySlug(taxonomy, slug);
  // }
}
