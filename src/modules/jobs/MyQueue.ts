import {
  Queue,
  QueueProcess,
  OnQueueActive,
  OnQueueEvent,
  BullQueueEvents,
} from 'nest-bull';
import { NumberService } from './number.service';
import { Job, DoneCallback } from 'bull';
import { Logger } from '@nestjs/common';
import { PostService } from '@app/modules/posts/post.service';

@Queue({ name: 'jobStore' })
export class MyQueue {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly service: NumberService,
    private readonly postService: PostService,
  ) {
  }

  @QueueProcess({ name: 'post-scheduled' })
  processPostFuture(job: Job) {
    // console.log('job-data' + JSON.stringify(job.data));
    // TODO: 内容定时发布业务说明
    // 当收到定时内容发布 job 时执行
    // 调用发布方法，按需求应该是提交到审核系统，审核后有个回调
    // this.postService
    return job.data;
  }

  //
  // @QueueProcess({ name: 'twice' })
  // processTwice(job: Job<number>) {
  //   return this.service.twice(job.data);
  // }
  //
  // @QueueProcess({ name: 'thrice' })
  // processThrice(job: Job<number>, callback: DoneCallback) {
  //   callback(null, this.service.thrice(job.data));
  // }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`,
    );
  }
}
