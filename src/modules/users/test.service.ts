import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { Connection, SelectQueryBuilder } from 'typeorm';
import {
  CreateManyDto,
  CrudController,
  CrudRequest,
  CrudRequestOptions,
  CrudService,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { ParsedRequestParams } from '@nestjsx/crud-request';
import { UserMeta } from '@app/modules/users/user-meta.entity';
import { mergeAllMeta } from '@app/common/utils';

@Injectable()
export class HeroesService extends TypeOrmCrudService<User> {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(User) repo) {
    super(repo);
  }

  getOne(req: CrudRequest): Promise<User> {
    const one = this.repo.findOne({
      relations: ['metas'],
      where: {
        req,
      },
    });
    return one;
    // return undefined;
  }

  // async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<any> | any[]> {
  //   req.options = Object.assign(req.options, {
  //     relations: ['metas'],
  //   })
  //   const selectQuery = await this.createBuilder(req.parsed, req.options, true);
  //   // console.log(selectQuery.getManyAndCount())
  //   // return selectQuery.getManyAndCount();
  //   // selectQuery.getRawAndEntities()
  //   return selectQuery.getRawMany();
  //   // console.log(req);
  //   // const data = await this.repo.find({
  //   //   relations: ['metas'],
  //   //   where: {
  //   //     ...req,
  //   //   },
  //   // });
  //   // const testData = mergeAllMeta(data);
  //   // console.log(testData);
  //   // return mergeAllMeta(data);
  //   // return undefined;
  //   // return data;
  // }

  // getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
  // getOne(req: CrudRequest): Promise<T>;
  // createOne(req: CrudRequest, dto: T): Promise<T>;
  // createMany(req: CrudRequest, dto: CreateManyDto<T>): Promise<T[]>;
  // updateOne(req: CrudRequest, dto: T): Promise<T>;
  // replaceOne(req: CrudRequest, dto: T): Promise<T>;
  // deleteOne(req: CrudRequest): Promise<void | T>;
  // decidePagination(parsed: ParsedRequestParams, options: CrudRequestOptions): boolean;
  // createBuilder(parsed: ParsedRequestParams, options: CrudRequestOptions, many?: boolean): Promise<SelectQueryBuilder<T>>;

  async list(special?: string) {
    // select *
    // from user_meta where value->'$.special' = 'education';
    if (special) {
      const data = await this.connection.manager.createQueryBuilder()
      // .select(`JSON_LENGTH(pm.value) as count`)
        .select()
        .from(UserMeta, 'meta')
        .innerJoin(query => {
          return query.from(User, 'user');
        }, 'user', 'user.id = meta.userId')
        .where(`value->'$.special'=:special`, { special })
        .getRawMany();
      const response = [];
      for (let item of data) {
        item = Object.assign({}, item, JSON.parse(item.value));
        Reflect.deleteProperty(item, 'key');
        Reflect.deleteProperty(item, 'value');
        Reflect.deleteProperty(item, 'verificationToken');
        Reflect.deleteProperty(item, 'passwordHash');
        Reflect.deleteProperty(item, 'identifierChangeToken');
        Reflect.deleteProperty(item, 'verified');
        Reflect.deleteProperty(item, 'createdAt');
        Reflect.deleteProperty(item, 'updatedAt');
        Reflect.deleteProperty(item, 'userId');
        response.push(item);
      }
      return response;
    } else {
      let data = await this.connection.getRepository(User).find({
        relations: ['metas'],
        // take: take || 10,
        // skip: 0,
        // cache: true,
      });
      data = mergeAllMeta(data);
      return data;
    }
  }

}
