import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { OptionService } from '@app/modules/options/option.service';
import { Injectable } from '@nestjs/common';
import { AnnouncementDto } from '@app/modules/announcement/announcement.dto';
import { PostService } from '@app/modules/posts/post.service';
import { PostEntity } from '@app/modules/posts/post.entity';
import { InjectQueue } from 'nest-bull';
import { Job, JobOptions, Queue } from 'bull';
import { JobDto } from '@app/modules/jobs/job.dto';
import { ApiModelProperty } from '@nestjs/swagger';

@Injectable()
export class AnouncementService {
  constructor(
    @InjectQueue('jobStore') readonly queue: Queue,
    @InjectConnection() private connection: Connection,
    // @InjectRepository(User) private readonly usersRepository: Repository<User>,
    // @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
    // private optionsService
    private readonly categoriesService: CategoriesService,
    private readonly optionService: OptionService,
    private readonly postService: PostService,
  ) {
    // 请求公告列表
    // 创建公告
    // 修改单个公告
    // 删除单个公告
    // 批量删除公司
  }

  public async create(dto: AnnouncementDto): Promise<PostEntity> {
    //   opts?: JobOptions;
    const newJob = new JobDto();
    newJob.data = {
      postId: 2,
    };
    newJob.opts = {
      delay: 2000,
    };
    const job: Job = await this.queue.add(newJob);
    console.log(job);

    return null;
    // scheduled
    // 发布事件
    // 定时发布处理
    // if (_.isEmpty(dto.scheduled)) {
    //   return this.postService.create(new PostEntity({
    //     title: dto.title,
    //     content: dto.content,
    //     author: dto.author,
    //     status: 'scheduled',
    //   }));
    // }
  }
}
