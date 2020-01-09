import { Module } from '@nestjs/common';
import { AnnouncementController } from '@app/modules/announcement/announcement.controller';
import { AnouncementService } from './anouncement.service';
import { BullModule } from 'nest-bull';
import { DoneCallback, Job } from 'bull';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { OptionService } from '@app/modules/options/option.service';
import { PostService } from '@app/modules/posts/post.service';

@Module({
  imports: [
    BullModule.register({
      name: 'jobStore',
    }),
  ],
  controllers: [AnnouncementController],
  providers: [AnouncementService, CategoriesService, OptionService, PostService],
  exports: [AnouncementService],
})
export class AnnouncementModule {
}
