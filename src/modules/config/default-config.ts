import { RuntimeBaseConfig } from '@app/common/base-config';
import { DEFAULT_AUTH_TOKEN_HEADER_KEY } from '@app/common/shared-constants';
import { TypeOrmLogger } from '@app/modules/config/logger/typeorm-logger';
import { AutoIncrementIdStrategy } from './entity-id-strategy/auto-increment-id-strategy';
import { DefaultLogger } from '@app/modules/config/logger/default-logger';

export const defaultConfig: RuntimeBaseConfig = {
  hostname: '',
  port: 80,
  cors: {
    origin: true,
    credentials: true,
  },
  authOptions: {
    disableAuth: false,
    tokenMethod: 'bearer',
    authTokenHeaderKey: DEFAULT_AUTH_TOKEN_HEADER_KEY,
    sessionDuration: '7d',
    requireVerification: true,
    verificationTokenDuration: '7d',
  },
  dbConnectionOptions: {
    type: 'mysql',
    logger: new TypeOrmLogger(),
  },
  entityIdStrategy: new AutoIncrementIdStrategy(),
  logger: new DefaultLogger(),
};
