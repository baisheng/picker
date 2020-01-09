import { User } from '@app/modules/users/user.entity';
import {
  Action,
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor, Feature,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Controller, Get, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiImplicitQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserMergeDto } from '@app/modules/users/user-merge.dto';
import { Allow } from '@app/decorators/allow.decorator';
import { Permission } from '@app/common/generated-types';
import { formatAllMeta, formatOneMeta } from '@app/common/utils';
import { UsersService } from '@app/modules/users/users.service';

@Crud({
  model: {
    type: User,
  },
  query: {
    exclude: ['updatedAt'],
    // allow: ['id', 'name', 'domain', 'description'],
    // filter: [{ field: 'id', operator: 'ne', value: 1 }],
    join: {
      metas: {
        //     allow: ['id'],
      },
    },
    maxLimit: 30,
  },
})
@Controller('users')
@Feature('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {
  }

  get base(): CrudController<User> {
    return this;
  }

  @Override('getOneBase')
  getOneAndDoStuff(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getOneBase(req);
  }

  // @Override('getManyBase')
  // async getMany(@ParsedRequest() req: CrudRequest) {
  //   let data = await this.base.getManyBase(req);
  //   return data;
  // }
  @Get('/read/me')
  @Allow(Permission.Authenticated, Permission.Owner)
  @Action('Read-One')
  async oneself(@Req() request: any) {
    return this.service.findOne({
      relations: ['metas'],
      where: {
        identifier: request.user.identifier,
      },
    });
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get('/export/list')
  // @Allow(Permission.Authenticated)
  @ApiOperation({ title: '查询用户列表' })
  @ApiImplicitQuery({ name: 'special', required: false, enum: ['finance', 'health', 'education'] })
  @ApiResponse({
    status: 200,
    description: '已查询到的用户记录.',
    type: UserMergeDto,
  })
  async index(
    @ParsedRequest() req: CrudRequest,
    @Query('special') special?: string) {
    // const data = await this.userService.paginate({
    //   page,
    //   limit,
    //   route: 'users',
    // }, { group });
    const data = await this.service.list(special);
    // 处理 meta 数据
    // await this.dealDataList(data.items);
    return data;
  }

  // getManyBase?(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
  // getOneBase?(req: CrudRequest): Promise<T>;
  // createOneBase?(req: CrudRequest, dto: T): Promise<T>;
  // createManyBase?(req: CrudRequest, dto: CreateManyDto<T>): Promise<T>;
  // updateOneBase?(req: CrudRequest, dto: T): Promise<T>;
  // replaceOneBase?(req: CrudRequest, dto: T): Promise<T>;
  // deleteOneBase?(req: CrudRequest): Promise<void | T>;
}
