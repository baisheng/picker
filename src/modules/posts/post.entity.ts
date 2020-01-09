import { IsArray, IsJSON, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { DeepPartial } from '@app/common/shared-types';
import { BaseEntity } from '@app/common/base.entity';
// import { Comment} from '@app/comments/comment.entity';
import { PostMeta } from './post-meta.entity';
import { ApiModelProperty } from '@nestjs/swagger';
// import { User } from '@app/entity';

// @Index(['name'], { unique: true })
// @Index(['type', 'status', 'createdDate', 'id'], { unique: true })
// @Index(['parent'])
// @Index(['author'])
@Entity('posts')
export class PostEntity extends BaseEntity {
  constructor(input?: DeepPartial<PostEntity>) {
    super(input);
  }
  @ApiModelProperty({
    description: '作者 id ',
    example: '1',
  })
  @Column({
    name: 'author',
    type: 'int',
    comment: '作者',
    nullable: true,
  })
  author: number;

  @ApiModelProperty({
    description: '内容状态, published: 已发布(发布中), review: 审核中, fail: 未通过, future: 待发布, scheduled: 定时中, auto-draft: 默认保存草稿, draft: 草稿, archive: 存档(已下线)，deleted: 已删除（已下线）',
    enum: ['published', 'draft', 'auto-draft', 'review', 'fail', 'future', 'scheduled', 'archive', 'delete'],
    example: 'published',
  })
  @Column({
    type: 'varchar',
    length: 20,
    default: 'published',
    comment: '内容状态',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '读取密码',
    nullable: true,
  })
  password: string;

  @ApiModelProperty({
    description: '标题',
    example: '这里是内容标题',
  })
  @Column({
    name: 'title',
    type: 'text',
    comment: '内容标题',
    nullable: true,
  })
  title: string;

  @ApiModelProperty({
    description: '内容唯一标识，如果未指定，则默认根据标题生成。如标题是汉字则会生成拼音 slug，如果包含字母则自动组合',
    example: 'biao-ti',
  })
  @Column({
    comment: '内容标识',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'guid',
    comment: '网络唯一地址 Global Unique ID for referencing the post.',
    nullable: true,
  })
  guid: string;

  @ApiModelProperty({
    description: '内容接要',
    example: '内容摘要',
  })
  @Column({
    comment: '内容摘要',
    nullable: true,
  })
  excerpt: string;

  @Column({
    name: 'type',
    // enum: ['article', 'page', 'attachment', 'revision', 'announcement', 'post-format'],
    // default: 'post-format',
    default: 'article',
    comment: '内容类型, article: 文章, page: 页面, announcement: 公告, attachment: 附件, revision: 修订版本, post-format: 格式化内容',
  })
  type: string;

  @ApiModelProperty({
    description: '内容',
    example: '内容',
  })
  @Column('text', {
    name: 'content',
    comment: '内容',
    nullable: true,
  })
  // @IsArray()
  content: string;

  @ApiModelProperty({
    description: '区块型内容, 多媒体编辑器使用 block 内容生成，如: 类型为 header、paragraph、list、delimiter、image',
    example: '[{"type":"header", "data": {"text":"", "level":2}}]',
  })
  @Column('json', {
    comment: '内容区块',
    nullable: true,
  })
  @IsJSON()
  block: any;

  @Column({
    type: 'boolean',
    comment: '格式',
    default: false,
  })
  allowComment: boolean;

  @Column({
    type: 'int',
  })
  commentNum: number;

  @Column({
    name: 'parent',
    comment: '父级内容',
    unsigned: true,
    type: 'int',
    default: 0,
  })
  parent: number;

  @Column({
    length: 100,
    nullable: true,
  })
  mimeType: string;

  @Column({
    comment: '菜单顺序',
    default: 0,
  })
  menuOrder: number;

  @Column({
    comment: '排序',
    default: 0,
  })
  sort: number;

  @OneToMany(type => PostMeta, postMeta => postMeta.post, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metas?: PostMeta[];

  // @OneToMany(type => Comment, comment => comment.post, {
  //   cascade: true,
  // })
  // comments?: Comment[];
}
