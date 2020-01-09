/**
 * Auth service.
 * @file 权限与管理员模块服务
 * @module module/auth/service
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
// import { Base64 } from 'js-base64';
import { Connection } from 'typeorm';
import crypto from 'crypto';
import ms from 'ms';

import * as APP_CONFIG from '../../app.config';
import { HttpUnauthorizedError } from '@app/common/errors/unauthorized.error';
import { ID } from '@app/common/shared-types';
import { ITokenResult } from '@app/common/types/common-types';
import { formatOneMeta } from '@app/common/utils';
import { User } from '@app/modules/users/user.entity';
import { PasswordCiper } from '@app/common/helpers/password-cipher/password-ciper';
import { RequestContext } from '@app/common/request-context';
import { EventBus } from '@app/modules/event-bus/event-bus';

import { AttemptedLoginEvent } from '../event-bus/events/AttemptedLoginEvent';
import { LoginEvent } from '../event-bus/events/login-event';
import { LogoutEvent } from '../event-bus/events/logout-event';
import { AuthenticatedSession } from '@app/modules/session/authenticated-session.entity';
import { ConfigService } from '@app/modules/config/config.service';
import { Session } from '@app/modules/session/session.entity';
import { AnonymousSession } from '@app/modules/session/anonymous-session.entity';

import * as got from 'got';

@Injectable()
export class AuthService {
  private readonly sessionDurationInMs: number;

  constructor(
    @InjectConnection() private connection: Connection,
    private configService: ConfigService,
    private passwordCipher: PasswordCiper,
    private readonly jwtService: JwtService,
    private eventBus: EventBus,
  ) {
    this.sessionDurationInMs = ms(this.configService.authOptions.sessionDuration as string);
  }

  async getPingAnToken(): Promise<any> {
    // 接口测试
    // post
    // https://test-api.pingan.com.cn:20443/oauth/oauth2/access_token
    // { "client_id":"P_BOB-UGC", "grant_type":"client_credentials", "client_secret":"46kdx2EX" }
    const tokenApi = 'https://test-api.pingan.com.cn:20443/oauth/oauth2/access_token';
    // (async () => {
    //   const body = await got.post('https://httpbin.org/anything', {
    //     body: {
    //       hello: 'world',
    //     },
    //   }).json();
    //
    //   console.log(body);
    // })();
    // const payload = (await got.post(
    //   '/console/api/coupon/sendCouponByActivity',
    //   {
    //     baseUrl: think.config('proxyCrmApi'),
    //     query
    //   }
    // )).body
  }

  // 验证 Auth 数据
  async validateAuthData(payload: any): Promise<any> {
    // const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
    // IF 是微信，返回唯一标识，一般为用户的 openid
    // IF Member 成员，会处理权限等，暂时未处理
    // if (payload.type === 'wechat' || payload.type === 'member') {
    // console.log(payload);
    const user = await this.connection.getRepository(User).findOne({
      identifier: payload.identifier,
    });
    if (user) {
      return payload;
    }
    // return null;
    // }
    // IF 是注册会员
    // WIP
  }

  /**
   * 鉴权，返回一个已授权的用户会话
   * @param ctx
   * @param identifier
   * @param password
   */
  // async authenticate(
  //   ctx: RequestContext,
  //   identifier: string,
  //   password: string,
  // ): Promise<AuthenticatedSession> {
  //   // 触发登录事件
  //   this.eventBus.publish(new AttemptedLoginEvent(ctx, identifier));
  //   const user = await this.getUserFromIdentifier(identifier);
  //   // console.log('查到用户？');
  //   // console.log(user);
  //   await this.verifyUserPassword(user.id, password);
  //   // const userObj: any = formatOneMeta(user, { cleanMeta: true });
  //   // 这里可以在配置服务中加上用户必需要经过验证后才能登录的开关，如果未通过校验
  //   // 如短信、email 验证用户，那么不允许登录
  //   // if (this.configService.authOptions.requireVerification && !user.verified) {
  //   //   throw new NotVerifiedError();
  //   // }
  //   const session = await this.createNewAuthenticatedSession(ctx, user);
  //   const newSession = await this.connection.getRepository(AuthenticatedSession).save(session);
  //   // this.eventBus.publish(new LoginEvent(ctx, user));
  //   return newSession;
  // }
  /**
   * 获取 平安开放平台 MFA 应用 Token
   */
  async getPinanToken() {
    // https://test-api.pingan.com.cn:20443/oauth/oauth2/access_token
  }

  /**
   * Authenticates a user's credentials and if okay, creates a new session.
   * 验证用户的凭据，如果正确，则创建一个新会话。
   */
  async authenticate(
    ctx: RequestContext,
    identifier: string,
    password: string,
  ): Promise<ITokenResult> {
    // 触发登录事件
    this.eventBus.publish(new AttemptedLoginEvent(ctx, identifier));
    const user = await this.getUserFromIdentifier(identifier);
    await this.verifyUserPassword(user.id, password);
    const userObj: any = formatOneMeta(user, { cleanMeta: true });
    // if (this.configService.authOptions.requireVerification && !user.verified) {
    //   throw new NotVerifiedError();
    // }
    const token = this.jwtService.sign({
      type: userObj.type,
      identifier,
      id: user.id,
    });
    return Promise.resolve({
      token,
      expiresIn: APP_CONFIG.AUTH.expiresIn as number,
    });
    // 处理用户是否需要验证与用户是否已经验证
    // if (this.configService.authOptions.requireVerification && !user.verified) {
    //   throw new NotVerifiedError();
    // }
    // const user = await
    // :TODO 可以处理用户 Session， 将 session 存储至数据库中
  }

  /**
   * 根据给定用户的密码验证所提供的密码
   * @param userId
   * @param password
   */
  async verifyUserPassword(userId: ID, password: string): Promise<boolean> {
    // const user = await this.connection.getRepository(User).findOne(userId);
    const user = await this.connection.getRepository(User).findOne({
      loadEagerRelations: false,
      where: {
        id: userId,
      },
      select: ['passwordHash'],
    }) as User;

    if (!user) {
      throw new HttpUnauthorizedError();
    }
    // const pwd = await this.passwordCipher.hash('abcd1234');
    // console.log(pwd);
    const passwordMathces = await this.passwordCipher.check(password, user.passwordHash ? user.passwordHash : '');
    if (!passwordMathces) {
      throw new HttpUnauthorizedError();
    }
    return true;
  }

  private async createNewAuthenticatedSession(
    ctx: RequestContext,
    user: User,
  ): Promise<AuthenticatedSession> {
    // 生成 session token
    const token = await this.generateSessionToken();
    // console.log('生成 token .....');
    return new AuthenticatedSession({
      token,
      user,
      expires: this.getExpiryDate(this.sessionDurationInMs),
      invalidated: false,
    });
  }

  /**
   * Deletes all existing sessions for the given user.
   */
  async deleteSessionsByUser(user: User): Promise<void> {
    await this.connection.getRepository(AuthenticatedSession).delete({ user });
  }

  /**
   * Deletes all sessions for the user associated with the given session token.
   */
  async deleteSessionByToken(ctx: RequestContext, token: string): Promise<void> {
    const session = await this.connection.getRepository(AuthenticatedSession).findOne({
      where: { token },
      relations: ['user'],
    });
    if (session) {
      this.eventBus.publish(new LogoutEvent(ctx));
      return this.deleteSessionsByUser(session.user);
    }
  }

  /**
   * Generates a random session token.
   */
  private generateSessionToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buf) => {
        if (err) {
          reject(err);
        }
        resolve(buf.toString('hex'));
      });
    });
  }

  /**
   * 根据用户唯一标识查找用户
   * @param identifier
   */
  async getUserFromIdentifier(identifier: string): Promise<User> {
    const user = await this.connection.getRepository(User).findOne({
      where: {
        identifier,
      },
    });
    // TODO: 处理 metas 并查询 _capabilities 以换取权限列表
    if (!user) {
      // throw new UnauthorizedError();
      throw new HttpUnauthorizedError();
    }
    const me = formatOneMeta(user);
    // console.log(me);
    // console.log(me);
    return user;
  }

  /**
   * Create an anonymous session.
   */
  async createAnonymousSession(): Promise<AnonymousSession> {
    const token = await this.generateSessionToken();
    const anonymousSessionDurationInMs = ms('1y');
    const session = new AnonymousSession({
      token,
      expires: this.getExpiryDate(anonymousSessionDurationInMs),
      invalidated: false,
    });
    // save the new session
    const newSession = await this.connection.getRepository(AnonymousSession).save(session);
    return newSession;
  }

  /**
   * 使用给定的令牌查找有效的会话，如果找到则返回一个。
   * @param token
   */
  async validateSession(token: string): Promise<Session | undefined> {
    const session = await this.connection.getRepository(Session).findOne({
      where: { token, invalidated: false },
      // relations: ['user', 'user.roles', 'user.roles.channels'],
    });
    if (session && session.expires > new Date()) {
      await this.updateSessionExpiry(session);
      return session;
    }
  }

  /**
   * 如果我们已经超过了当前会话的到期日期的一半，那么我们将更新它。
   *
   * 这可以确保在活动使用时会话不会过期，但是可以防止我们过期
   * 需要对*every*请求运行更新查询。
   */
  private async updateSessionExpiry(session: Session) {
    const now = new Date().getTime();
    if (session.expires.getTime() - now < this.sessionDurationInMs / 2) {
      await this.connection
        .getRepository(Session)
        .update({ id: session.id }, { expires: this.getExpiryDate(this.sessionDurationInMs) });
    }
  }

  /**
   * 根据将来到期的时间返回将来的到期日期。
   */
  private getExpiryDate(timeToExpireInMs: number): Date {
    return new Date(Date.now() + timeToExpireInMs);
  }

  async idVerification() {}
  /*    // 修改管理员信息
      public putAdminInfo(auth: Auth): Promise<Auth> {

          // 密码解码
          const password = this.decodeBase64(auth.password);
          const new_password = this.decodeBase64(auth.new_password);
          const rel_new_password = this.decodeBase64(auth.rel_new_password);

          return new Promise((resolve, reject) => {
              // 验证密码
              if (password || new_password || rel_new_password) {
                  const isLackConfirmPassword = !new_password || !rel_new_password;
                  const isDissimilarityConfirmPassword = new_password !== rel_new_password;
                  const isIncludeOldPassword = [new_password, rel_new_password].includes(password);
                  // 判定密码逻辑
                  if (isLackConfirmPassword || isDissimilarityConfirmPassword) {
                      return reject('密码不一致或无效');
                  }
                  if (isIncludeOldPassword) {
                      return reject('新旧密码不可一致');
                  }
              }
              return resolve();
          }).then(_ => {

              // 修改前查询验证
              // return this.authModel.findOne().exec();
          }).then(extantAuth => {

              // 核对已存在密码
              const isExistedAuth = extantAuth && !!extantAuth._id;
              const extantAuthPwd = extantAuth && extantAuth.password;
              const extantPassword = extantAuthPwd || this.decodeMd5(APP_CONFIG.AUTH.defaultPassword);

              // 修改密码 -> 判断旧密码是否一致
              if (password) {
                  if (extantPassword !== this.decodeMd5(password)) {
                      return Promise.reject('原密码不正确');
                  } else {
                      auth.password = this.decodeMd5(rel_new_password);
                      Reflect.deleteProperty(auth, 'new_password');
                      Reflect.deleteProperty(auth, 'rel_new_password');
                  }
              }

              // 新建数据或保存已有
              return isExistedAuth
                  ? Object.assign(extantAuth, auth).save()
                  : new this.authModel(auth).save();
          });
      }

      // 登陆/创建 Token
      public createToken(password: string): Promise<ITokenResult> {
          return this.authModel.findOne(null, 'password').exec().then(auth => {
              const extantAuthPwd = auth && auth.password;
              const extantPassword = extantAuthPwd || this.decodeMd5(APP_CONFIG.AUTH.defaultPassword);
              const submittedPassword = this.decodeMd5(this.decodeBase64(password));
              if (submittedPassword === extantPassword) {
                  const access_token = this.jwtService.sign({data: APP_CONFIG.AUTH.data});
                  return Promise.resolve({access_token, expires_in: APP_CONFIG.AUTH.expiresIn});
              } else {
                  return Promise.reject('密码不匹配');
              }
          });
      }*/
}
