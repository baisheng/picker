import { UserMeta } from './user-meta.entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserMergeDto {
  @ApiModelProperty({
    description: '用户ID',
    example: 1,
  })
  readonly id: string;
  @ApiModelProperty({
    description: '用户唯一标识（账号、手机号）',
    example: '13488689887',
  })
  readonly identifier: string;
  @ApiModelProperty({
    description: '用户类型(个人、媒体、机构、政府、其他)',
    example: 'personal',
  })
  type: string;
  @ApiModelProperty({
    description: '用户真实姓名',
    example: '李香',
  })
  realName?: string;
  @ApiModelProperty({
    description: '用户对外显示的名称（昵称）',
    example: '蓝蓝的天空白白的云',
  })
  displayName?: string;
  @ApiModelProperty({
    description: '用户的内容专项, 如：财经、健康、教育',
    enum: ['finance', 'health', 'education'],
    example: 'education',
  })
  special: string;
  @ApiModelProperty({
    description: '性别, 如：1:男，0:女',
    example: '1',
  })
  sex: number;
  @ApiModelProperty({
    description: '用户电子邮箱',
    example: 'hi@picker.cc',
  })
  email: string;
  @ApiModelProperty({
    description: '用户简介',
    example: '毕业于汉语言文学专业，带过两届拼音班。热爱教育工作，擅长与学生沟通，具有亲和力。',
  })
  intro: string;
  @ApiModelProperty({
    description: '用户手机号',
    example: '13488689887',
  })
  phone: string;
  @ApiModelProperty({
    description: '头像地址',
    example: 'https://upload.jianshu.io/users/upload_avatars/2558050/7761b285-2805-4534-9870-ba7dcc7538ec.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240',
  })
  avatar: string;
  @ApiModelProperty({
    description: '国家',
    example: '中国',
  })
  country: string;
  @ApiModelProperty({
    description: '城市',
    example: '北京',
  })
  city: string;
  @ApiModelProperty({
    description: '地区',
    example: '丰台',
  })
  province: string;
}
