import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Permission } from '@app/common/generated-types';

import { formatOneMeta } from '@app/common/utils';
import { Allow } from '@app/decorators/allow.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { ID, PaginatedList } from '@app/common/shared-types';
import { ApiImplicitQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserMeta } from '@app/modules/users/user-meta.entity';
import { UserMergeDto } from '@app/modules/users/user-merge.dto';
import {UserService} from '@app/modules/users/user.service';

@Controller('internal')
export class InternalController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Get('users')
  @ApiOperation({ title: '查询用户列表' })
  @ApiImplicitQuery({ name: 'special', required: false, enum: ['finance', 'health', 'education'] })
  @ApiResponse({
    status: 200,
    description: '已查询到的用户记录.',
    type: UserMergeDto,
  })
  async getUsers(
    @Query('special') special?: string) {
    // limit = limit > 100 ? 100 : limit;
    // const data = await this.userService.paginate({
    //   page,
    //   limit,
    //   route: 'users',
    // }, { group });
    const data = await this.userService.list(special);
    // 处理 meta 数据
    // await this.dealDataList(data.items);
    return data;
  }

  // @Get(':id')
  // @Allow(Permission.Authenticated)
  // findOne(@Param('id') id: number) {
  //   return this.userService.getDetailById(id);
  // }
  // @Get('/find/:identifier')
  // findByIdentifier(@Param('identifier') identifier: string) {
  //   return this.userService.findByIdentifier(identifier);
  // }
}
