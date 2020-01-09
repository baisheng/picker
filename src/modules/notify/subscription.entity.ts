import { IsArray, IsJSON, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { DeepPartial, ID } from '@app/common/shared-types';
import { BaseEntity } from '@app/common/base.entity';
import { ApiModelProperty } from '@nestjs/swagger';

// @Index(['name'], { unique: true })
// @Index(['type', 'status', 'createdDate', 'id'], { unique: true })
// @Index(['parent'])
// @Index(['author'])
/**
 * target: 123,  // 产品A的ID
 * targetType: 'product',
 * action: 'comment',
 * user: 123  // 王大锤的ID
 */
@Entity('subscription')
export class Subscription extends BaseEntity {
  constructor(input?: DeepPartial<Subscription>) {
    super(input);
  }

  @ApiModelProperty({
    description: '目标的 id 比如文章ID',
    example: '7',
  })
  target: number;

  @ApiModelProperty({
    description: '目标的所属类型',
    example: 'post',
  })
  targetType: string;

  @ApiModelProperty({
    description: '订阅动作，如：comment/like/post/update/approved etc.',
    example: 'post',
  })
  action: string;

  @ApiModelProperty({
    description: '用户 id',
    example: '1',
  })
  @Column({
    type: 'int',
    comment: '用户',
    nullable: true,
  })
  user: number;
}
