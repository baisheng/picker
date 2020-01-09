import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from 'nest-bull';
import { Job, JobOptions, Queue } from 'bull';
import { Allow } from '@app/decorators/allow.decorator';
import { Permission } from '@app/common/generated-types';
import { ApiBearerAuth, ApiImplicitQuery, ApiResponse } from '@nestjs/swagger';
import { JobDto } from '@app/modules/jobs/job.dto';
@Controller('jobs')
@ApiBearerAuth()
export class JobController {
  constructor(
    @InjectQueue('jobStore') readonly queue: Queue,
  ) {
  }
  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: '任务添加成功'})
  @Allow(Permission.Authenticated)
  async addJob(@Body() dto: JobDto) {
    const job: Job = await this.queue.add(dto.name, dto.data, dto.opts);
    return job.id;
  }

  async getJob(@Param('id') id: string) {
    return await this.queue.getJob(id);
  }
}
