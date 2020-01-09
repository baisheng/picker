import { Session } from './session.entity';
import { ChildEntity } from 'typeorm';
import { DeepPartial } from '@app/common/shared-types';

@ChildEntity()
export class AnonymousSession extends Session {
  constructor(input: DeepPartial<AnonymousSession>) {
    super(input);
  }
}
