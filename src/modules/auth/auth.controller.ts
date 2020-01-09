import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import got from 'got';
import { Permission } from '@app/common/generated-types';
import { ITokenResult } from '@app/common/types/common-types';
// import { Logger } from '../../../config';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { IQueryParamsResult, QueryParams } from '@app/decorators/query-params.decorator';
import { AuthService } from '@app/modules/auth/auth.service';
import { Allow } from '@app/decorators/allow.decorator';
import { AuthLogin } from './auth.dto';
import { Ctx } from '@app/decorators/request-context.decorator';
import { RequestContext } from '@app/common/request-context';
import { Request, Response } from 'express';
import { LoginResult } from '@app/modules/auth/LoginResult';
import { BaseAuthController } from '@app/modules/auth/base-auth.controller';
import { UserService } from '@app/modules/users/user.service';
import { ConfigService } from '@app/modules/config/config.service';
// import { ID } from '@app/common/shared-types';
// import { Context } from '@nestjs/graphql';
import * as svgCaptcha from 'svg-captcha';
import { UserDto } from '@app/modules/users/user.dto';
import { PasswordCiper } from '@app/common/helpers/password-cipher/password-ciper';

@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected userService: UserService,
    private passwordCipher: PasswordCiper,
    protected configService: ConfigService,
  ) {
  }

  // login(): Promise<LoginResult> {
  //
  // }
  // @Post('test')
  // @Allow(Permission.Public)
  // test(
  //   @Body() body: AuthLogin,
  //   @Ctx() ctx,
  // ) {
  //   return ctx;
  // }
  //
  // @Post('logind')
  // @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  // @Allow(Permission.Public)
  // logina(
  //   @Body() body: AuthLogin,
  //   @Ctx() ctx: any,
  //   @Req() req: any,
  //   @Res() res: any,
  //   // @Context('res') res: Response,
  // ) {
  //   return super.login(body, ctx, req);
  // }
  @Post('login')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  @Allow(Permission.Public)
  createToken(
    @Ctx() ctx,
    @QueryParams() { visitors: { ip } }: IQueryParamsResult,
    @Body() body: AuthLogin): Promise<ITokenResult> {
    return this.authService.authenticate(ctx, body.identifier, body.password)
      .then(token => {
        return token;
      });
  }
  @Post('logout')
  @HttpProcessor.handle({ message: '登出', error: HttpStatus.BAD_REQUEST })
  @Allow(Permission.Owner)
  async logout(
    @QueryParams() { visitors: { ip } }: IQueryParamsResult,
    @Req() req: any,
  ): Promise<boolean> {
    console.log('loutout .....');
    // return super.logout(ctx, req, res);
    // 记录登出日志
    return true;
  }

  /**
   * 用户注册
   * @param ctx
   * @param ip
   * @param body
   */
  @Post('signup')
  @HttpProcessor.handle({ message: '用户注册', error: HttpStatus.BAD_REQUEST })
  async signup(
    @Ctx() ctx,
    @QueryParams() { visitors: {ip}}: IQueryParamsResult,
    @Body() body: AuthLogin,
  ) {
    const userDto = new UserDto();
    userDto.displayName = body.displayName;
    userDto.identifier = body.identifier;
    userDto.passwordHash = await this.passwordCipher.hash(body.password);
    await this.userService.create(userDto);
    console.log(userDto);
    // return newUser;
    return this.authService.authenticate(ctx, body.identifier, body.password)
      .then(token => {
        return token;
      });
  }
  //
  // @Allow(Permission.Authenticated, Permission.Owner)
  // async me(@Ctx() ctx: RequestContext) {
  //   return super.me(ctx);
  // }

  @Get('captcha')
  async getCaptcha(
    @Res() res: Response,
  ) {
    const captcha = svgCaptcha.create();

    // 声明响应类型为“svg”，作用是会返回一张图片
    // 否则captcha.data的数据是“<svg></svg>”
    res.type('svg');
    res.status(HttpStatus.OK).send(captcha.data);
  }

  /**
   * 授权后的用户信息
   */
  @Get('info')
  @HttpProcessor.handle({ message: '权限用户信息获取', error: HttpStatus.BAD_REQUEST })
  @Allow(Permission.Authenticated, Permission.Owner)
  getUser(@Req() req: any) {
    // console.log(ctx);
    // return ctx;
    // return req.user;
    return this.authService.getUserFromIdentifier(req.user.identifier);
  }

  @Post('check')
  @Allow(Permission.Owner)
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }
  /**
   * 身份证校验
   */
  @Post('idcard')
  async idVerification() {}
}
