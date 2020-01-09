import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getFeature, getAction } from '@nestjsx/crud';
enum CrudActions {
  ReadAll = 'Read-All',
  ReadOne = 'Read-One',
  CreateOne = 'Create-One',
  CreateMany = 'Create-Many',
  UpdateOne = 'Update-One',
  ReplaceOne = 'Replace-One',
  DeleteOne = 'Delete-One',
}
@Injectable()
export class ACLGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getHandler();
    const controller = ctx.getClass();

    const feature = getFeature(controller);
    const action = getAction(handler);

    console.log(`${feature}-${action}`); // e.g. 'Heroes-Read-All'

    return true;
  }
}
