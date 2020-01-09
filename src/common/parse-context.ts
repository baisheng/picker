import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';

/**
 * 在传入请求的Nest ExecutionContext中解析，负责 GraphQL & REST请求
 */
export function parseContext(
  context: ExecutionContext | ArgumentsHost,
): { req: Request; res: Response; isGraphQL: boolean; info?: GraphQLResolveInfo } {
  const graphQlContext = GqlExecutionContext.create(context as ExecutionContext);
  const restContext = GqlExecutionContext.create(context as ExecutionContext);
  const info = graphQlContext.getInfo();
  let req: Request;
  let res: Response;
  if (info) {
    const ctx = graphQlContext.getContext();
    req = ctx.req;
    res = ctx.res;
  } else {
    req = context.switchToHttp().getRequest();
    res = context.switchToHttp().getResponse();
  }
  return {
    req,
    res,
    info,
    isGraphQL: !!info,
  };
}
