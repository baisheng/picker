import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';

import { extractAuthToken } from '../common/extract-auth-token';
import { parseContext } from '../common/parse-context';
import { REQUEST_CONTEXT_KEY, RequestContextService } from '../common/request-context.service';
import { setAuthToken } from '../common/set-auth-token';
import { PERMISSIONS_METADATA_KEY } from '../decorators/allow.decorator';
import { ConfigService } from '@app/modules/config/config.service';
import { AuthService } from '@app/modules/auth/auth.service';
import { Permission } from '@app/common/generated-types';
import { Session } from '@app/modules/session/session.entity';
import { HttpForbiddenError } from '@app/common/errors/forbidden.error';
import { AnonymousSession } from '@app/modules/session/anonymous-session.entity';
import { AuthGuard } from '@nestjs/passport';

/**
 * 用于检查请求中是否存在有效的会话令牌，如果找到，将当前用户实体附加到请求。
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  strategy: any;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private authService: AuthService,
    private requestContextService: RequestContextService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req, res, info } = parseContext(context);
    const authDisabled = this.configService.authOptions.disableAuth;
    const permissions = this.reflector.get<Permission[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
    const isPublic = !!permissions && permissions.includes(Permission.Public);
    const hasOwnerPermission = !!permissions && permissions.includes(Permission.Owner);
    const session = await this.getSession(req, res, hasOwnerPermission);
    // if (session) {
    // console.log('has session .asd.f.asdfmasdlkjfkldsjflkjasl');
    const requestContext = await this.requestContextService.fromRequest(req, info, permissions, session);
    (req as any)[REQUEST_CONTEXT_KEY] = requestContext;
    if (authDisabled || !permissions || isPublic) {
      return true;
    } else {
      const canActivate = requestContext.isAuthorized || requestContext.authorizedAsOwnerOnly;
      if (!canActivate) {
        throw new HttpForbiddenError();
      } else {
        return canActivate;
      }
    }
  }

  private async getSession(
    req: Request,
    res: Response,
    hasOwnerPermission: boolean,
  ): Promise<Session | undefined> {
    const authToken = extractAuthToken(req, this.configService.authOptions.tokenMethod);
    let session: Session | undefined;
    if (authToken) {
      session = await this.authService.validateSession(authToken);
      if (session) {
        return session;
      }
      // 如果有令牌，但它不能在会话中验证，
      // 那么这个令牌就不再有效，取消设置。
      setAuthToken({
        req,
        res,
        authOptions: this.configService.authOptions,
        rememberMe: false,
        authToken: '',
      });
    }

    if (hasOwnerPermission && !session) {
      session = await this.authService.createAnonymousSession();
      setAuthToken({
        authToken: session.token,
        rememberMe: true,
        authOptions: this.configService.authOptions,
        req,
        res,
      });
    }
    return session;
  }
}
