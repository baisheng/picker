import { AuthService } from '@app/modules/auth/auth.service';
import { UserService } from '@app/modules/users/user.service';
import { ConfigService } from '@app/modules/config/config.service';
import { LoginResult } from '@app/modules/auth/LoginResult';
import { RequestContext } from '@app/common/request-context';
import { HttpForbiddenError } from '@app/common/errors/forbidden.error';
import { User } from '@app/modules/users/user.entity';
import { ID } from '@app/common/shared-types';
import { setAuthToken } from '@app/common/set-auth-token';
import { AuthOptions } from '@app/common/base-config';
import { Request, Response } from 'express';
import { AuthLogin } from '@app/modules/auth/auth.dto';
import { extractAuthToken } from '@app/common/extract-auth-token';
import * as _ from 'lodash';
// export interface CurrentUser {
//   id: ID;
//   identifier: string;
// }
export class BaseAuthController {
  constructor(
    protected authService: AuthService,
    protected userService: UserService,
    protected configService: ConfigService,
  ) {
  }

  /**
   * 根据用户的用户名和密码尝试登录。如果成功,返回用户数据，并返回 cookie 或 token。
   */
  async login(
    login: AuthLogin,
    ctx: RequestContext,
    req: Request,
  ){
    return await this.createAuthenticatedSession(ctx, req, login);
  }

  /**
   * 登出
   * @param ctx
   * @param req
   * @param res
   */
  async logout(ctx: RequestContext, req: Request, res: Response): Promise<boolean> {
    const token = extractAuthToken(req, this.configService.authOptions.tokenMethod);
    if (!token) {
      return false;
    }
    await this.authService.deleteSessionByToken(ctx, token);
    setAuthToken({
      req,
      res,
      authOptions: this.configService.authOptions,
      rememberMe: false,
      authToken: '',
    });
    return true;
  }

  /**
   * 返回关于当前已验证用户的信息。
   * @param ctx
   */
  async me(ctx: RequestContext) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new HttpForbiddenError();
    }
    const user = userId && (await this.userService.getUserById(userId));
    // return user ? this.pu
    // return user && null;
    return user;
  }

  /**
   * 创建已验证的会话并设置会话令牌。
   * @param ctx
   * @param req
   * @param res
   * @param login
   */
  protected async createAuthenticatedSession(
    ctx: RequestContext,
    req: Request,
    login: AuthLogin,
  ) {
    const session: any = await this.authService.authenticate(ctx, login.identifier, login.password);
    // 客户端可以从头部拿到的信息
    // setAuthToken({
    //   req,
    //   res,
    //   authOptions: this.configService.authOptions,
    //   rememberMe: login.rememberMe || false,
    //   authToken: session.token,
    // });
    if (_.has(session, 'user')) {
      return {
        id: session.user.id,
        identifier: session.user.identifier,
        // ...session.user,
        token: session.token,
        // permissions: new Array()
      };
    }
    return {
    };
    // return {
    //   user: this.publiclyAccessibleUser(session.user),
    // };
  }

  /**
   * 更新现有用户的密码。
   * todo: 待实现
   */
  protected async updatePassword(
    ctx: RequestContext,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const { activeUserId } = ctx;
    if (!activeUserId) {
      // throw new InternalServerError(`error.no-active-user-id`);
      throw new HttpForbiddenError();
    }
    // return this.userService.updatePassword(activeUserId, currentPassword, newPassword);
    return false;
  }

  // private publiclyAccessibleUser(user: User): LoginResult {
  //   return {
  //     id: user.id,
  //     identifier: user.identifier,
  //     token
  // id: user.id as string,
  // identifier: user.identifier,
  // channels: this.getCurrentUserChannels(user),
  // };
  // }
}
