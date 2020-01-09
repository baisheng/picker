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
import { ID } from '@app/common/shared-types';

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

  /**
   * 向 Notify 表中插入一条公告记录
   * @param content
   * @param sender
   */
  public createAnnounce(content: string, sender: any) {}

  /**
   * 向 Notify 表中插入一条提醒记录
   * @param target
   * @param targetType
   * @param action
   * @param sender
   * @param content
   */
  public createRemind(target: number, targetType: string, action: string, sender: any, content: string) {}

  /**
   * 1 向 notify 表中插入一条信息记录
   * 2 向 UserNotify 表中插入一条记录，并关联新建的 Notify
   * @param content
   * @param sender
   * @param receiver
   */
  public createMessage(content: string, sender: any, receiver: any) {}

  /**
   * 1 从 UserNotify 中获取最近的一条公告信息的创建时间: updatedTime
   * 2 用 `updatedTime` 作为过滤条件，查询 Notify 的公告信息
   * 3 新建 UserNotify 并关联查询出来的公告信息
   * @param user
   */
  public pullAnnounce(user: ID) {}

  /**
   * 1 查询用户的订阅表，得到用户的一系列订阅记录
   * 2 通过每一条的订阅记录的target、targetType、action、createdAt去查询Notify表，获取订阅的Notify记录。（注意订阅时间必须早于提醒创建时间）
   * 3 查询用户的配置文件SubscriptionConfig，如果没有则使用默认的配置DefaultSubscriptionConfig
   * 4 使用订阅配置，过滤查询出来的Notify
   * 5 使用过滤好的Notify作为关联新建UserNotify
   * @param user
   */
  public pullRemind(user: ID) {}

  /**
   * 1 通过reason，查询NotifyConfig，获取对应的动作组:actions
   * 2 遍历动作组，每一个动作新建一则Subscription记录
   * @param user
   * @param target
   * @param targetType
   * @param reason
   */
  public subscribe(user: ID, target: number, targetType: string, reason) {}

  /**
   * 删除user、target、targetType对应的一则或多则记录
   * @param user
   * @param target
   * @param targetType
   */
  public cancelSubscription(user: ID, target: number, targetType: string) {}

  /**
   * 查询SubscriptionConfig表，获取用户的订阅配置
   * @param userID
   */
  getSubscriptionConfig(user: ID) {}

  /**
   * 更新用户的SubscriptionConfig记录
   * @param userID
   */
  updateSubscriptionConfig(user: ID) {}

  /**
   * 获取用户的消息列表
   * @param userID
   */
  getUserNotify(user: ID) {}

  /**
   * 更新指定的notify，把isRead属性设置为true
   * @param user
   * @param notifyIDs
   */
  read(user: ID, notifys: ID[]) {}
}
