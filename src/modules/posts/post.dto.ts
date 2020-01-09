import { ApiModelProperty } from '@nestjs/swagger';
import { Column, JoinColumn, OneToMany } from 'typeorm';
import { IsDefined, IsInt, IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { PostMeta } from '@app/modules/posts/post-meta.entity';
import { ID } from '@app/common/shared-types';

export class PostDto {
  @ApiModelProperty({
    description: '作者 id ',
    example: '1',
  })
  author: number;

  @ApiModelProperty({
    description: '内容状态, publish: 已发布(发布中), review: 审核中, fail: 未通过, future: 待发布, auto-draft: 默认保存草稿, draft: 草稿, archive: 存档(已下线)，delete: 已删除（已下线）',
    enum: ['publish', 'draft', 'auto-draft', 'review', 'fail', 'future', 'archive', 'delete'],
    example: 'publish',
  })
  status: string;

  @ApiModelProperty({
    description: '定时发布',
    example: '2019-11-11',
  })
  scheduled: Date;
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

  @ApiModelProperty({
    description: '内容接要',
    example: '内容摘要',
  })
  @Column({
    comment: '内容摘要',
    nullable: true,
  })
  excerpt: string;

  type?: string;

  @ApiModelProperty({
    description: '内容',
    example: '内容',
  })
    // @IsDefined()
    // @IsNotEmpty({ message: '内容？' })
  content: string;

  @ApiModelProperty({
    description: '区块型内容, 多媒体编辑器使用 block 内容生成，如: 类型为 header、paragraph、list、delimiter、image',
    example: '[{"type":"header", "data": {"text":"", "level":2}}]',
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

  parent: number;

  mimeType: string;

  menuOrder: number;

  sort: number;

  @OneToMany(type => PostMeta, postMeta => postMeta.post, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metas?: PostMeta[];

  @ApiModelProperty({
    description: '类别 ID',
    example: '1',
  })
  // @IsDefined()
  // @IsNotEmpty({ message: '类别？' })
  @IsInt({ message: '整数？' })
  categories?: ID[];

  @ApiModelProperty({
    description: '用于内容格式的类别 ID',
    example: '3',
  })
  format?: string;

  password: string;
}
