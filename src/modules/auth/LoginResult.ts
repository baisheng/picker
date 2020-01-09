import { Permission } from '@app/common/generated-types';
import { ID } from '@app/common/shared-types';

export class LoginResult {
  id: ID;
  identifier: string;
  token: string;
  permissions?: Array<Permission>;
}
