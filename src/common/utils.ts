import * as _ from 'lodash';
import crypto from 'crypto';
import got from 'got';

// import 'lodash/common/function';
/**
 * Takes a predicate function and returns a negated version.
 */
export function not(predicate: (...args: any[]) => boolean) {
  return (...args: any[]) => !predicate(...args);
}

/**
 * Returns a predicate function which returns true if the item is found in the set,
 * as determined by a === equality check on the given compareBy property.
 */
export function foundIn<T>(set: T[], compareBy: keyof T) {
  return (item: T) => set.some(t => t[compareBy] === item[compareBy]);
}

/**
 * Indentity function which asserts to the type system that a promise which can resolve to T or undefined
 * does in fact resolve to T.
 * Used when performing a "find" operation on an entity which we are sure exists, as in the case that we
 * just successfully created or updated it.
 */
export function assertFound<T>(promise: Promise<T | undefined>): Promise<T> {
  return promise as Promise<T>;
}

/**
 * Compare ID values for equality, taking into account the fact that they may not be of matching types
 * (string or number).
 */
// export function idsAreEqual(id1?: ID, id2?: ID): boolean {
//   if (id1 === undefined || id2 === undefined) {
//     return false;
//   }
//   return id1.toString() === id2.toString();
// }

/**
 * Returns the AssetType based on the mime type.
 */
// export function getAssetType(mimeType: string): AssetType {
//     const type = mimeType.split('/')[0];
//     switch (type) {
//         case 'image':
//             return AssetType.IMAGE;
//         case 'video':
//             return AssetType.VIDEO;
//         default:
//             return AssetType.BINARY;
//     }
// }

/**
 * A simple normalization for email addresses. Lowercases the whole address,
 * even though technically the local part (before the '@') is case-sensitive
 * per the spec. In practice, however, it seems safe to treat emails as
 * case-insensitive to allow for users who might vary the usage of
 * upper/lower case. See more discussion here: https://ux.stackexchange.com/a/16849
 */
export function normalizeEmailAddress(input: string): string {
  return input.trim().toLowerCase();
}

// 内部参数类型
export interface IFilterConfig {
  filterKey?: any;
  cleanMeta?: boolean;
}

/**
 * Format and transform meta list to meta Object
 * @param list
 * @param config IFilterConfig
 */
export function formatAllMeta(list: any, config?: IFilterConfig) {
  const items: any = [];
  for (const item of (config && config.filterKey ? _.map(list, config.filterKey) : list)) {
    item.meta = {};
    if (_.has(item, 'metas') && item.metas.length > 0) {
      _formatMeta(item, config && config.cleanMeta);
    }
    items.push(item);
  }
  return items;
}

export function mergeAllMeta(list: any, config?: IFilterConfig) {
  const items: any = [];
  const customizer = (objValue, srcValue) => {
    return _.isUndefined(objValue) ? srcValue : objValue;
  };

  for (const item of (config && config.filterKey ? _.map(list, config.filterKey) : list)) {
    // item.meta = {};
    if (_.has(item, 'metas')) {
      if (item.metas.length > 0) {
        // _formatMeta(item, config && config.cleanMeta);
        for (const meta of item.metas) {
          if (meta.key.includes('data')) {
            // item = Object.assign(item, meta.value);
            // item = _.partialRight(_.assignInWith, customizer);
            // defaults(item, meta.value);
            _.assignInWith(item, meta.value, customizer);
          }
          // item.meta[meta.key] = meta.value;
        }
        // Reflect.deleteProperty(item, 'key');
        // Reflect.deleteProperty(item, 'value');
        Reflect.deleteProperty(item, 'verificationToken');
        Reflect.deleteProperty(item, 'passwordHash');
        Reflect.deleteProperty(item, 'identifierChangeToken');
        // Reflect.deleteProperty(item, 'verified');
        // Reflect.deleteProperty(item, 'createdAt');
        // Reflect.deleteProperty(item, 'updatedAt');
        // tslint:disable-next-line:no-unused-expression
        // clean && Reflect.deleteProperty(item, 'meta');
      }
    }
    Reflect.deleteProperty(item, 'metas');
    items.push(item);
  }
  return items;
}

/**
 * 格式化单个对象的元数据信息
 * @param item
 * @param config
 */
export function formatOneMeta(item: any, config?: IFilterConfig) {
  item = config && config.filterKey ? _.get(item, config.filterKey) : item;
  item.meta = {};
  if (_.has(item, 'metas') && item.metas.length > 0) {
    _formatMeta(item, config && config.cleanMeta);
  }
  // Reflect.deleteProperty(item, 'meta');
  return item;
}

function _formatMeta(item: any, clean?: boolean) {
  for (const meta of item.metas) {
    if (meta.key.includes('_capabilities')) {
      const capabilities = meta.value;
      if (_.isArray(capabilities)) {
        const roles = [];
        for (const capitalize of capabilities) {
          roles.push(capitalize.role);
        }
        item = Object.assign(item, { roles });
      }
      // item = Object.assign(item, meta.value);
    }
    if (meta.key.includes('info')) {
      item = Object.assign(item, meta.value);
    }
    if (meta.key.includes('_wechat')) {
      const wechat = meta.value;
      item = Object.assign(item, {
        avatarUrl: wechat.avatarUrl,
      });
    }
    if (meta.key.includes('_liked_posts')) {
      item.liked = meta.value;
    }
    item.meta[meta.key] = meta.value;
  }
  Reflect.deleteProperty(item, 'metas');
  // tslint:disable-next-line:no-unused-expression
  clean && Reflect.deleteProperty(item, 'meta');
}

export function hMacSHA265(data: string, key: string) {
  const hmac = crypto.createHmac('sha256', key).update(data).digest('hex');
  return hmac;
}

/**
 * SHA 工具
 * @param data
 * @param hashType 默认 sha256
 */
export function sha(data: string, hashType?: string) {
  if (!hashType) {
    hashType = 'sha256';
  }
  // const sign_data: string = 'POST' + '\n';
  const hash = crypto.createHash(hashType);
  hash.update(data);
  // console.log();
  // const sha = crypto.createHash('sha265').update(data).digest('hex')
  return hash.digest('hex');
}

// interface Header {
//   getName: string;
//   getValue: string;
// }
export function getSign(httpMethod: string, apiMethod: string, apiParam: string, httpHeaders: [], bodyHash: string) {
  const appId: string = 'APP7C215A212F7F46BEAB75001C364AB56D';
  const appKey: string = '993615CB5D524233B5E6C8EC17093AA6';
//    private String comparison_api = "https://biap-is-stg.pa18.com:10030/biap/face/v1/comparison";
  const comparisonApi = 'https://biap-is-stg.pingan.com.cn/biap/face/v1/comparison';

  let signData = httpMethod + '\n';
  signData = signData + apiMethod + '\n';
  if (apiParam === '') {
    signData = signData + '\n';
  } else {
    signData = signData + apiParam + '\n';
  }
  // for (let header of httpHeaders) {
  // }

  const request = got.extend({
    prefixUrl: 'https://biap-is-stg.pingan.com.cn/biap/face/',
    responseType: 'buffer',
    headers: {
      'Content-type': 'application/json;charset=utf-8',
      'X-Appid': appId,
      'X-Deviceid': 'test_client',
      'X-Timestamp': new Date().getTime().toString(),
    },
  });
}
