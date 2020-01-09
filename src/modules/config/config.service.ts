import { AuthOptions, BaseConfig, RuntimeBaseConfig } from '@app/common/base-config';
import { Injectable } from '@nestjs/common';
import { getConfig } from '@app/modules/config/config-helpers';
import { BaseLogger, Logger } from '@app/modules/config/logger/base-logger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { EntityIdStrategy } from '@app/modules/config/entity-id-strategy/entity-id-strategy';
import { ConnectionOptions } from 'typeorm';

@Injectable()
export class ConfigService implements BaseConfig {
  private activeConfig: RuntimeBaseConfig;

  constructor() {
    this.activeConfig = getConfig();
    if (this.activeConfig.authOptions.disableAuth) {
      // tslint:disable-next-line
      Logger.warn('Auth已被禁用。对于生产系统来说，永远不应该出现这种情况!');
    }
  }

  get authOptions(): Required<AuthOptions> {
    return this.activeConfig.authOptions;
  }

  get port(): number {
    return this.activeConfig.port;
  }

  get cors(): boolean | CorsOptions {
    return this.activeConfig.cors;
  }

  get entityIdStrategy(): EntityIdStrategy {
    return this.activeConfig.entityIdStrategy;
  }

  get dbConnectionOptions(): ConnectionOptions {
    return this.activeConfig.dbConnectionOptions;
  }

  get logger(): BaseLogger {
    return this.activeConfig.logger;
  }
}
