import { Column, Entity, Index, OneToOne, PrimaryColumn } from 'typeorm';
import { DeepPartial, ID } from '@app/common/shared-types';

/**
 * 分类与分类对象关联表
 */
@Entity()
// @Index(['objectId', 'taxonomyId'])
export class TermRelationships {
  constructor(input?: DeepPartial<TermRelationships>) {
    if (input) {
      for (const [key, value] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }
  @PrimaryColumn({
    type: 'int',
    comment: '内容对象 id',
  })
  objectId: ID;

  @PrimaryColumn({
    type: 'int',
    comment: '分类法 id',
  })
  taxonomyId: ID;

  @Column({
    type: 'int',
    comment: '分类排序',
    default: 0,
  })
  sort: number;

  // @ManyToOne(type => TermTaxonomy, termTaxonomy => termTaxonomy.term, {
  //   cascade: true,
  // })
  // taxonomy: TermTaxonomy;
}
