// 内部系统对接 API
import { DocumentBuilder, SwaggerBaseConfig, SwaggerModule } from '@nestjs/swagger';
import { InternalModule } from '@app/modules/internal/internal.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { UserModule } from '@app/modules/users/user.module';
import { INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class ApiDocument {
  private readonly app: INestApplication;

  constructor(app) {
    this.app = app;
  }

  public build() {
    this.createInternalDoc();
    this.createAuthDoc();
    this.createUsersDoc();
  }

  private createDocument(apiPath, opts: SwaggerBaseConfig, modules: any[]) {
    const document = SwaggerModule.createDocument(this.app, opts, {
      include: modules,
    });
    SwaggerModule.setup(apiPath, this.app, document);
  }

  /**
   * 创建用于内部系统对接的开放 API
   */
  private createInternalDoc() {
    const internalOptions = new DocumentBuilder()
      .setTitle('PICKER API')
      .setDescription('PICKER 内容创作系统API')
      .setVersion('1.0')
      .addTag('内部开放 API')
      .build();
    this.createDocument('api', internalOptions, [InternalModule]);
  }

  /**
   * 创建权限 API 文档
   */
  private createAuthDoc() {
    const options = new DocumentBuilder()
      .setTitle('PICKER API')
      .setDescription('PICKER 权限 API')
      .setVersion('1.0')
      .addTag('权限')
      .build();
    this.createDocument('api/auth', options, [AuthModule]);
  }

  private createUsersDoc() {
    const options = new DocumentBuilder()
      .setTitle('PICKER API')
      .setDescription('PICKER 用户 API')
      .setVersion('1.0')
      .addTag('用户')
      .addBearerAuth()
      .build();
    this.createDocument('api/users', options, [UserModule]);
  }
}
