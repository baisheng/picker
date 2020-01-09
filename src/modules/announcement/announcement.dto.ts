import { ApiModelProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ID } from '@app/common/shared-types';

export class AnnouncementDto {
  @ApiModelProperty({
    description: '作者 id ',
    example: '1',
  })
  author: number;
  @ApiModelProperty({
    description: '内容状态, publish: 已发布(发布中), review: 审核中, fail: 未通过, future: 待发布, auto-draft: 默认保存草稿, draft: 草稿, archive: 存档(已下线)，delete: 已删除（已下线）',
    enum: ['publish', 'draft', 'auto-draft', 'review', 'fail', 'future', 'archive', 'delete'],
    example: 'future',
  })
  status: string;
  @ApiModelProperty({
    description: '定时发布',
    example: '2019-11-11',
  })
  scheduled: Date;
  @ApiModelProperty({
    description: '公告标题',
    example: '这里是公告标题',
  })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;
  @ApiModelProperty({
    description: '公告内容',
    example: '这里是公告内容',
  })
  content: string;
  @ApiModelProperty({
    description: '公告类别, 5: 官方公示, 6: 功能优化, 7: 违规公示',
    enum: [5, 6, 7],
    example: 5,
  })
  category: ID;
}
