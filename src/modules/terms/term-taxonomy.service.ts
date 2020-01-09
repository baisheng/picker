import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CacheService } from '@app/processors/cache/cache.service';
import { ID } from '@app/common/shared-types';
import { Term } from '@app/modules/terms/term.entity';
import { TermTaxonomy } from '@app/modules/terms/term-taxonomy.entity';
import { TermRelationships } from '@app/modules/terms/term-relationships.entity';

@Injectable()
export class TermTaxonomyService {
  constructor(
    @InjectConnection() private connection: Connection,
    // @InjectRepository(User) private readonly usersRepository: Repository<User>,
    // @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly cacheService: CacheService,
  ) {
  }

  /**
   * 添加对象的分类关联，多类别
   * @param objectId
   * @param taxonomyId
   */
  async relationships(objectId: ID, taxonomyId: ID) {
    return await this.connection.getRepository(TermRelationships)
      .save({
        objectId,
        taxonomyId,
      });
  }

  /**
   * 添加对象的分类关联，单一分类
   * @param objectId
   * @param taxonomyId
   */
  async relationshipsSingle(objectId: ID, taxonomyId: ID) {
    const res = await this.connection.getRepository(TermRelationships).findOne({
      objectId,
      taxonomyId,
    });
    if (_.isEmpty(res)) {
      return this.connection.getRepository(TermRelationships)
        .save({
          objectId,
          taxonomyId,
        })
        .then(entity => {
          return entity;
        });
    } else {
      return this.connection.getRepository(TermRelationships).delete({
        objectId,
        taxonomyId,
      });
    }
  }
}
