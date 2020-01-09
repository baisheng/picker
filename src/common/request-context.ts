/**
 * @description
 * RequestContext保存与当前请求相关的信息，可能是
 * 需要在堆栈的不同点。
 */
import { Session } from '@app/modules/session/session.entity';
import { User } from '@app/modules/users/user.entity';
import { AuthenticatedSession } from '@app/modules/session/authenticated-session.entity';
import { AnonymousSession } from '@app/modules/session/anonymous-session.entity';
import { ID } from '@app/common/shared-types';

export class RequestContext {
  private readonly _session?: Session | undefined;
  private readonly _isAuthorized: boolean;
  private readonly _authorizedAsOwnerOnly: boolean;

  // private readonly _apiType:

  /**
   * @internal
   */
  constructor(options: {
    session?: Session;
    isAuthorized: boolean;
    authorizedAsOwnerOnly: boolean;
  }) {
    const { session } = options;
    this._session = session;
    this._isAuthorized = options.isAuthorized;
    this._authorizedAsOwnerOnly = options.authorizedAsOwnerOnly;
  }

  /**
   * @description
   * 从一个普通对象创建一个新的RequestContext对象，它是
   * JSON序列化-反序列化操作。
   * @param ctxObject
   */
  static fromObject(ctxObject: any): RequestContext {
    let session: Session | undefined;
    if (ctxObject._session) {
      if (ctxObject._session.user) {
        const user = new User(ctxObject._session.user);
        session = new AuthenticatedSession({
          ...ctxObject._session,
          user,
        });
      } else {
        session = new AnonymousSession(ctxObject._session);
      }
    }
    return new RequestContext({
      session,
      isAuthorized: ctxObject._isAuthorized,
      authorizedAsOwnerOnly: ctxObject._authorizedAsOwnerOnly,
    });
  }

  get session(): Session | undefined {
    return this._session;
  }

  get activeUserId(): ID | undefined {
    const user = this.activeUser;
    if (user) {
      return user.id;
    }
  }

  get activeUser(): User | undefined {
    if (this.session) {
      if (this.isAuthenticatedSession(this.session)) {
        return this.session.user;
      }
    }
  }

  /**
   * @description
   * 如果当前会话被授权访问当前冲突解决程序方法。
   */
  get isAuthorized(): boolean {
    return this._isAuthorized;
  }

  /**
   * @description
   * 如果当前匿名会话仅被授权对以下实体进行操作，则为True
   * 属于当前会话。
   */
  get authorizedAsOwnerOnly(): boolean {
    return this._authorizedAsOwnerOnly;
  }

  private isAuthenticatedSession(session: Session): session is AuthenticatedSession {
    return session.hasOwnProperty('user');
  }
}
