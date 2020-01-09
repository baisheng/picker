import { ID } from '@app/common/shared-types';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsEmpty, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TagDto {
  @ApiModelProperty({
    description: '标签名称',
    example: '标签名',
  })
  @IsDefined()
  @IsNotEmpty({ message: '标签名称？' })
  @IsString({ message: '字符？' })
  name: string;
  @ApiModelProperty({
    description: '标签标识',
    example: 'biao1-qian2-ming2',
  })
  // @IsString({ message: '字符？' })
  slug?: string;
  @ApiModelProperty({
    description: '标签描述',
    example: '这是用于标识内容所属性质的标签',
  })
  // @IsString({ message: '字符？' })
  description?: string;
  @ApiModelProperty({
    description: '父级标签',
    example: '父级标签',
  })
  // @IsInt({ message: '内容 ID？' })
  // @IsEmpty()
  parent?: ID;
}
