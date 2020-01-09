import { defaultConfig } from './default-config';
import { mergeConfig } from './merge-config';
import { DeepPartial } from '@app/common/shared-types';
import { BaseConfig, RuntimeBaseConfig } from '@app/common/base-config';

let activeConfig = defaultConfig;

/**
 * 通过合并提供的值来覆盖默认配置。应该只使用之前启动应用程序。
 */
export function setConfig(userConfig: DeepPartial<BaseConfig>): void {
  activeConfig = mergeConfig(activeConfig, userConfig);
}

/**
 * 返回app配置对象。一般来说，这个函数应该是
 * 在启动应用程序之前使用。在所有其他上下文中，{@link ConfigService} 应该用来访问配置设置。
 */
export function getConfig(): Readonly<RuntimeBaseConfig> {
  return activeConfig;
}
