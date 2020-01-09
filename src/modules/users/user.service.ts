import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { ID } from '@app/common/shared-types';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { patchEntity } from '@app/common/helpers/utils/patch-entity';
import { IPaginationOptions, Pagination, paginate } from '@app/common/paginate';
import { PostEntity } from '@app/modules/posts/post.entity';
import addCustomEqualityTester = jasmine.addCustomEqualityTester;
import { UserMeta } from '@app/modules/users/user-meta.entity';
import { PostMeta } from '@app/modules/posts/post-meta.entity';
import { formatAllMeta, mergeAllMeta } from '@app/common/utils';
// import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class UserService{
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {
  }

  public create(newUser: UserDto): Promise<User> {
    return this.connection.getRepository(User).save(newUser).then(user => {
      return user;
    });
  }

  async createOrUpdate(input: Partial<User>): Promise<User> {
    let user: User;
    const existing = await this.connection.getRepository(User).findOne({
      where: {
        identifier: input.identifier,
      },
    });
    if (existing) {
      user = patchEntity(existing, input);
      // user = new Users(input);
    } else {
      user = new User(input);
    }
    console.log('s-s-s--')
    return this.connection.getRepository(User).save(user);
  }

// 创建几个相片
//   let photo = new Photo();
//   photo.name = "Me and Bears";
//   photo.description = "I am near polar bears";
//   photo.filename = "photo-with-bears.jpg";
//   photo.albums = [album1, album2];
//   await connection.manager.save(photo);
  async updateUser(user: User): Promise<User> {
    return await this.connection.getRepository(User).save(user);
    // this.connection.getRepository(UserMeta).save()
  }

  public getDetailById(id: number): Promise<User | undefined> {
    return this.connection.getRepository(User).findOne({
      relations: ['metas'],
      where: {
        id,
      },
    });
  }

  /**
   * 分页查询
   * @param options
   */
  async paginate(options: IPaginationOptions, searchOptions?): Promise<Pagination<User>> {
    // const data = await this.connection.getRepository(User).find();
    // console.log(data);
    return await paginate<User>(this.connection.getRepository(User), options, searchOptions);
  }

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
  async getUserById(userId: ID): Promise<User | undefined> {
    return this.connection.getRepository(User).findOne(userId, {
      // relations: ['meta']
    });
  }
  /**
   * 根据 ids 批量返回数据
   * @param ids
   */
  getUsersDetailByIds(ids: ID[]) {
    return this.connection.getRepository(User).findByIds(ids);
  }

/*
  async updatePassword(userId: ID, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.connection.getRepository(User).findOne(userId, { select: ['id', 'passwordHash'] });
    if (!user) {
      // throw new InternalServerError(`error.no-active-user-id`);
    }
    const matches = await this.passwordCipher.check(currentPassword, user.passwordHash);
    if (!matches) {
      // throw new UnauthorizedError();
      throw new UnauthorizedException();
    }
    user.passwordHash = await this.passwordCipher.hash(newPassword);
    await this.connection.getRepository(User).save(user);
    return true;
  }
*/

  /**
   * 按用户唯一标识查询用户是否存在
   * @param identifier
   */
  findByIdentifier(identifier: string): Promise<User | undefined> {
    return this.connection.getRepository(User).findOne({
      relations: ['metas'],
      where: {
        identifier,
      },
    });
  }
}
