import { JobOptions } from 'bull';
import { ApiModelProperty } from '@nestjs/swagger';

export class JobDto {
  @ApiModelProperty({
    description: '任务名称',
    example: 'post-scheduled',
  })
  name?: 'post-scheduled';
  @ApiModelProperty({
    description: '任务内容',
    example: '{postId: 2}',
  })
  data: any;
  @ApiModelProperty({
    description: '任务配置',
    example: '{delay: 1000}',
  })
  opts?: JobOptions;
}
