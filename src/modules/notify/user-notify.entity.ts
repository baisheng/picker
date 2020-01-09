import { IsArray, IsJSON, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { DeepPartial, ID } from '@app/common/shared-types';
import { BaseEntity } from '@app/common/base.entity';
// import { Comment} from '@app/comments/comment.entity';
// import { PostMeta } from './post-meta.entity';
import { ApiModelProperty } from '@nestjs/swagger';
// import { User } from '@app/entity';

/**
 * UserNotify 存储用户的消息队列，它叛逆一则提醒(Notify)的具体内容
 * UserNotify 的建立，主要通过两个途径:
 *
 * 1、遍例订阅（Subscription）表拉取公告(Announce）和提醒(Remind)的时候创建
 * 2、新建信息（Message）之后，立刻创建
 */
// @Index(['name'], { unique: true })
// @Index(['type', 'status', 'createdDate', 'id'], { unique: true })
// @Index(['parent'])
// @Index(['author'])
@Entity('UserNotify')
export class UserNotify extends BaseEntity {
  constructor(input?: DeepPartial<UserNotify>) {
    super(input);
  }

  @ApiModelProperty({
    description: '标识阅读状态',
    example: true,
  })
  isRead: boolean;

  @ApiModelProperty({
    description: '用户消息所属者',
    example: 1,
  })
  @Column({
    name: 'user',
    type: 'int',
    comment: '用户',
    nullable: true,
  })
  user: number;

  @ApiModelProperty({
    description: '关联的消息',
    example: 11,
  })
  notify: number;
}
