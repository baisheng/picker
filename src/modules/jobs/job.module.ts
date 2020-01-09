import { Global, Module } from '@nestjs/common';
import { BullModule } from 'nest-bull';
import { DoneCallback, Job } from 'bull';
import { JobController } from '@app/modules/jobs/job.controller';
import { MyQueue } from '@app/modules/jobs/MyQueue';
import { NumberService } from '@app/modules/jobs/number.service';
import { PostService } from '@app/modules/posts/post.service';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { OptionService } from '@app/modules/options/option.service';

const QueueModule = BullModule.register({
  name: 'jobStore',
  options: {
    redis: {
      host: 'redis',
      port: 6379,
    },
  },
  processors: [
    (job: Job, done: DoneCallback) => {
      done(null, done(null, job.data));
    },
  ],
});
Module({
  imports: [QueueModule],
  controllers: [
    JobController,
  ],
  providers: [NumberService, CategoriesService, OptionService, PostService, MyQueue],
  exports: [QueueModule],
});
export class JobModule {
}
