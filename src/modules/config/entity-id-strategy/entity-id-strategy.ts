/**
 * @description
 * 定义用于数据库中所有实体的主键类型。
 * “increment”使用一个自动递增的整数，而“uuid”使用一个
 * uuid字符串。
 *
 * @docsCategory entities
 * @docsPage Entity Configuration
 */
import { ID } from '@app/common/shared-types';

export type PrimaryKeyType = 'increment' | 'uuid';

/**
 * @description
 * EntityIdStrategy确定如何生成和存储实体id
 * 数据库，以及它们在从API传递到服务层。
 *
 * @docsCategory entities
 * @docsPage Entity Configuration
 */
export interface EntityIdStrategy<T extends ID = ID> {
  readonly primaryKeyType: PrimaryKeyType;
  encodeId: (primaryKey: T) => string;
  decodeId: (id: string) => T;
}

export interface IntegerIdStrategy extends EntityIdStrategy<number> {
  readonly primaryKeyType: 'increment';
  encodeId: (primaryKey: number) => string;
  decodeId: (id: string) => number;
}

export interface StringIdStrategy extends EntityIdStrategy<string> {
  readonly primaryKeyType: 'uuid';
  encodeId: (primaryKey: string) => string;
  decodeId: (id: string) => string;
}
