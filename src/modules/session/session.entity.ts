import { BaseEntity } from '@app/common/base.entity';
import { Column, Entity, Index, ManyToOne, TableInheritance } from 'typeorm';
import { User } from '@app/modules/users/user.entity';

/**
 * @description
 * 当用户向API发出请求时，将创建会话。一个会话可以是一个AnonymousSession
 * 对于未经身份验证的用户，否则为经过身份验证的会话。
 *
 * @docCategory enitites
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Session extends BaseEntity {
  @Index({ unique: true })
  @Column()
  token: string;

  @Column() expires: Date;

  @Column() invalidated: boolean;

  // @ManyToOne(type => User)
  // activeUser: User | null;
}
