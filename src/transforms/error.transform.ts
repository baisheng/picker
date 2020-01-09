/**
 * Error transform.
 * @file 错误转换器
 * @description 抓换各种特定格式的错误数据
 * @module transform/error
 */

export function getMessageFromNormalError(error: any): any {
  return error && error.message || error;
}

export function getMessageFromAxiosError(error: any): any {
  return error
    && error.response
    && error.response.data
    || getMessageFromNormalError(error);
}
