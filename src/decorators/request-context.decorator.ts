import { createParamDecorator } from '@nestjs/common';

import { REQUEST_CONTEXT_KEY } from '../common/request-context.service';
import { Reflector } from '@nestjs/core';
import { AnonymousSession } from '@app/modules/session/anonymous-session.entity';

/**
 * @description
 * 请求参数装饰器，它从传入数据中提取{@link RequestContext}
 * 请求对象。
 *
 * @example
 * ```TypeScript
 *  \@Query()
 *  getAdministrators(\@Ctx() ctx: RequestContext) {
 *      // ...
 *  }
 * ```
 *
 * @docsCategory request
 * @docsPage Decorators
 */
export const Ctx = createParamDecorator((data, arg) => {
  if (Array.isArray(arg)) {
    // GraphQL request
    return arg[2].req[REQUEST_CONTEXT_KEY];
  } else {
    // REST request
    // console.log('开始注入内容');
    const request = arg[REQUEST_CONTEXT_KEY];
    // console.log(request);
    // if (request._session === undefined) {
    //   request._session = new AnonymousSession({ createdAt: new Date() });
    // }
    // console.log(request);
    return request;
  }
});
