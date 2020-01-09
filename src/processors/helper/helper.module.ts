/**
 * Helper module.
 * @file Helper 全局模块
 * @module processor/helper/module
 */

import { Module, Global, HttpModule } from '@nestjs/common';
import { QiniuService } from './helper.service.qiniu';
import { EmailService } from './helper.service.email';
import { SeoService } from './helper.service.seo';
import { IpService } from './helper.service.ip';
import {AttachmentService} from './helper.service.attachment';
import {PasswordCiper} from '@app/common/helpers/password-cipher/password-ciper';

const services = [ QiniuService, EmailService, SeoService, IpService, AttachmentService, PasswordCiper];
@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
