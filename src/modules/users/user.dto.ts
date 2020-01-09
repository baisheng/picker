import { UserMeta } from './user-meta.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { IsEmailOrPhone } from '@app/modules/auth/isEmailOrPhone.validator';

export class UserDto {
  @ApiModelProperty({
    description: '账户名',
    example: 'username',
  })
  @IsDefined()
  @IsNotEmpty({ message: '手机号或邮箱？' })
  @IsString({ message: '字符串？' })
  @Validate(IsEmailOrPhone, {
    message: '需要输入手机号或邮箱',
  })
  identifier: string;
  @ApiModelProperty({
    description: '账户密码',
    example: 'abcd1234',
  })
  @IsDefined()
  @IsNotEmpty({ message: '请填写密码' })
  @IsString({ message: '字符串？' })
  passwordHash?: string;
  @ApiModelProperty({
    description: '昵称',
    example: '你的昵称',
  })
  @IsOptional()
  @IsString({ message: '字符串？' })
  @IsDefined()
  displayName?: string;
  verified?: boolean;
  @ApiModelProperty({
    description: '验证码',
    example: '1234',
  })
  @IsOptional()
  @IsString({ message: '字符串？' })
  @IsDefined()
  verificationToken?: string | null;
  identifierChangeToken?: string | null;
  metas?: UserMeta[];
}
