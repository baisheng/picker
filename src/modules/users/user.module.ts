/**
 * Option module.
 * @file 用户模块
 * @module module/users/module
 */

import { Module } from '@nestjs/common';
import { UserService } from '@app/modules/users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/modules/users/user.entity';
import { UsersController } from '@app/modules/users/users.controller';
import { UsersService } from '@app/modules/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService, UsersService],
  exports: [UserService],
})
export class UserModule {
}
