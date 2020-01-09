import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RequestContext } from '@app/common/request-context';
import { Permission } from '@app/common/generated-types';
import { Session } from '@app/modules/session/session.entity';
import { AuthenticatedSession } from '@app/modules/session/authenticated-session.entity';
import { ConfigService } from '@app/modules/config/config.service';
import { GraphQLResolveInfo } from 'graphql';
import { AnonymousSession } from '@app/modules/session/anonymous-session.entity';

// import { ConfigService } from '../config';
export const REQUEST_CONTEXT_KEY = '_RequestContext';

@Injectable()
export class RequestContextService {
  // constructor(private configService: ConfigService) {
  // }

  async fromRequest(
    req: Request,
    info?: GraphQLResolveInfo,
    requiredPermissions?: Permission[],
    session?: Session,
  ): Promise<RequestContext> {
    const hasOwnerPermission = !!requiredPermissions && requiredPermissions.includes(Permission.Owner);
    // const user = session && (session as AuthenticatedSession).user;
    // 用来解析用户权限列表来判断用户访问当前频道、版块或者指定内容的权限
    // 当前需求中暂时无需处理直接授权
    // const isAuthorized = this.userHasRequiredPermissionsOnChannel(requiredPermissions, channel, user);
    const isAuthorized = true;
    const authorizedAsOwnerOnly = !isAuthorized && hasOwnerPermission;

    return new RequestContext({
      session,
      isAuthorized,
      authorizedAsOwnerOnly,
    });
  }

  private isAuthenticatedSession(session?: Session): session is AuthenticatedSession {
    return !!session && !!(session as AuthenticatedSession).user;
  }

  // private userHasRequiredPermissionsOnChannel(
  //   permissions: Permission[] = [],
  //   channel?: Channel,
  //   user?: User,
  // ): boolean {
  //   if (!user || !channel) {
  //     return false;
  //   }
  //   const permissionsOnChannel = user.roles
  //     .filter(role => role.channels.find(c => idsAreEqual(c.id, channel.id)))
  //     .reduce((output, role) => [...output, ...role.permissions], [] as Permission[]);
  //   return this.arraysIntersect(permissions, permissionsOnChannel);
  // }
  //
  /**
   * 如果arr2中出现了arr1的任何元素，则返回true。
   */
  // private arraysIntersect<T>(arr1: T[], arr2: T[]): T {
  //   return arr1.reduce(
  //     (intersects, role) => {
  //       return intersects || arr2.includes(role);
  //     },
  //     false as boolean,
  //   );
  // }
}
