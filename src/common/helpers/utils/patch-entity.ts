import { BaseEntity } from '../../base.entity';

export type InputPatch<T> = { [K in keyof T]?: T[K] | null };

/**
 * Updates only the specified properties from an Input object as long as the value is not
 * null or undefined.
 * 只要值不是 null 或 undefined, 就更新输入对象的指定属性。
 */
export function patchEntity<T extends BaseEntity, I extends InputPatch<T>>(entity: T, input: I): T {
  for (const key of Object.keys(entity)) {
    const value = input[key as keyof T];
    if (key === 'customFields') {
      patchEntity((entity as any)[key], value as any);
    } else if (value != null && key !== 'id') {
      entity[key as keyof T] = value as any;
    }
  }
  return entity;
}
