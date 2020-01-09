import { Session } from './session.entity';
import { ChildEntity, ManyToOne } from 'typeorm';
import { DeepPartial } from '@app/common/shared-types';
import { User } from '@app/modules/users/user.entity';

@ChildEntity()
export class AuthenticatedSession extends Session {
  constructor(input: DeepPartial<AuthenticatedSession>) {
    super(input);
  }

  @ManyToOne(type => User)
  user: User;
}
