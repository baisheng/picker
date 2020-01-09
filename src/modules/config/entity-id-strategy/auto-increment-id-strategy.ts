import { IntegerIdStrategy } from './entity-id-strategy';

/**
 * 所有实体使用自动递增整数作为主键的 id 策略
 */
export class AutoIncrementIdStrategy implements IntegerIdStrategy {
  readonly primaryKeyType = 'increment';

  decodeId(id: string): number {
    const asNumber = +id;
    return Number.isNaN(asNumber) ? -1 : asNumber;
  }

  encodeId(primaryKey: number): string {
    return primaryKey.toString();
  }
}
