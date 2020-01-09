import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConnectionOptions } from 'typeorm';
import { EntityIdStrategy } from '@app/modules/config/entity-id-strategy/entity-id-strategy';
import { BaseLogger } from '@app/modules/config/logger/base-logger';

export interface AuthOptions {
  /**
   * 禁用身份验证和权限检查
   * 不要在生产中设置为 true, 它只是用来开发工作
   */
  disableAuth?: boolean;

  /**
   * @description
   * 设置传送和读取会话令牌的方法。
   * 'cookie':登录后，返回'Set-Cookie'头信息，设置
   * 包含会话令牌的cookie。基于浏览器的客户机(使用凭据发出请求)
   * 应自动发送会话cookie与每个请求。
   * “bearer”:登录时，令牌在响应中返回，然后应由
   * 客户端应用程序。每个请求应该包括头部 `Authorization:Bearer <token> `。
   */
  tokenMethod?: 'bearer' | 'cookie';

  /**
   * @description
   *
   * 设置header属性，该属性将在使用“Bearer”方法时用于发送验证令牌。
   *
   * @default 'x-auth-token'
   */
  authTokenHeaderKey?: string;
  /**
   * @description
   * 会话持续时间，即最后一个经过验证的请求必须经过的时间
   * 之后，用户必须重新验证。
   *
   * Expressed 表示为描述时间跨度的字符串
   * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
   *
   * @default '7d'
   */
  sessionDuration?: string | number;
  /**
   * @description
   * 确定新用户帐户是否需要验证他们的电子邮件地址
   * @defaut true
   */
  requireVerification?: boolean;

  /**
   * @description
   * 设置验证令牌有效的时间长度，过期后必须刷新验证令牌。
   *
   * Expressed as a string describing a time span per
   * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
   *
   * @default '7d'
   */
  verificationTokenDuration?: string | number;
}

export interface BaseConfig {
  authOptions: AuthOptions;
  /**
   * @description
   * Set the CORS handling for the server. See the [express CORS docs](https://github.com/expressjs/cors#configuration-options).
   *
   * @default { origin: true, credentials: true }
   */
  cors?: boolean | CorsOptions;
  /**
   * @description
   * TypeORM 用于连接数据库的连接选项。
   */
  dbConnectionOptions: ConnectionOptions;
  /**
   * @description
   * 在数据库中定义用于存储实体主键的策略
   * ,并且在暴露时对这些id进行编码和解码
   * 通过API的实体。默认使用简单的自动递增整数策略。
   *
   * @default new AutoIncrementIdStrategy()
   */
  entityIdStrategy?: EntityIdStrategy<any>;
  /**
   * @description
   * 设置服务器的主机名。如果没有设置，服务器将在本地主机上可用。
   *
   * @default ''
   */
  hostname?: string;

  /**
   * @description
   * 服务器应该监听哪个端口。
   *
   * @default 3000
   */
  port: number;

  logger?: BaseLogger;
}

export interface RuntimeBaseConfig extends Required<BaseConfig> {
  authOptions: Required<AuthOptions>;
  // assetOptions: Required<AssetOptions>
  // importExportOptions: Required<ImportExportOptions>
}
