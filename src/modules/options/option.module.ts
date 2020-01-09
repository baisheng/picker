/**
 * Option module.
 * @file 设置模块
 * @module module/option/module
 */

import { Module, OnModuleInit } from '@nestjs/common';
import { OptionController } from './option.controller';
// import { OptionProvider } from './option.entity';
import { OptionService } from './option.service';

@Module({
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule implements OnModuleInit{
  constructor(
    private optionService: OptionService,
  ) {
  }

  async onModuleInit() {
    // 初始化配置
    await this.optionService.load(true);
    // const smsOption = await this.optionService.getOption('sms');
    // console.log(JSON.stringify(smsOption));
  }

}
