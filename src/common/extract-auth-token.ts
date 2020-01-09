import { Request } from 'express';
import { AuthOptions } from '@app/common/base-config';
import * as _ from 'lodash';
/**
 * 根据情况从 cookie 或 Authorization header 获取会话令牌
 * 使用已配置的 tokenMethod。
 */
export function extractAuthToken(req: Request, tokenMethod: AuthOptions['tokenMethod']): string | undefined {
  if (tokenMethod === 'cookie') {
    if (_.has(req, 'session') && _.has(req.session, 'token')) {
      return req.session.token;
    }
  } else {
    const authHeader = req.get('Authorization');
    if (authHeader) {
      const matches = authHeader.match(/bearer\s+(.+)$/i);
      if (matches) {
        return matches[1];
      }
    }
  }
}
