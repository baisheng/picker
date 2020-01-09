/**
 * Auth module.
 * @file 权限与管理员模块
 * @module module/auth/module
 */

import * as APP_CONFIG from '@app/app.config';
import {Secret} from 'jsonwebtoken';
import { Module } from '@nestjs/common';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordCiper } from '@app/common/helpers/password-cipher/password-ciper';
import { ConfigService } from '@app/modules/config/config.service';
import { EventBus } from '@app/modules/event-bus/event-bus';
import { UserService } from '@app/modules/users/user.service';
// signOptions?: jwt.SignOptions;
// secret?: string | Buffer;
// publicKey?: string | Buffer;
// privateKey?: jwt.Secret;
// secretOrPrivateKey?: jwt.Secret;
// secretOrKeyProvider?: (requestType: JwtSecretRequestType, tokenOrPayload: string | object | Buffer, options?: jwt.VerifyOptions | jwt.SignOptions) => jwt.Secret;
// verifyOptions?: jwt.VerifyOptions;
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: APP_CONFIG.AUTH.jwtTokenSecret as Secret,
      signOptions: {
        expiresIn: APP_CONFIG.AUTH.expiresIn as number,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [ConfigService, EventBus, UserService, AuthService, JwtStrategy, PasswordCiper],
  exports: [AuthService, PasswordCiper, ConfigService],
})
export class AuthModule {
}
