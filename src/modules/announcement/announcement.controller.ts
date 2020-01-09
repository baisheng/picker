import { Body, Controller, Get, Query } from '@nestjs/common';
import { Allow } from '@app/decorators/allow.decorator';
import { Permission } from '@app/common/generated-types';
import { PostService } from '@app/modules/posts/post.service';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { AnnouncementDto } from '@app/modules/announcement/announcement.dto';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly postService: PostService) {
  }

  /**
   * 按分页条件查询全部内容
   * @param page
   * @param limit
   */
  @Get()
  @Allow(Permission.Authenticated)
  @HttpProcessor.handle('获取公告')
  async index(@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    const data = await this.postService.paginate({
      page,
      limit,
      route: 'announcement',
    });
    // 处理 meta 数据
    // await this.dealDataList(data.items);
    return data;
  }

  @Allow(Permission.SuperAdmin)
  create(@Body() announcement: AnnouncementDto) {
    // return this.postService.create()
    return 'success';
  }
}
