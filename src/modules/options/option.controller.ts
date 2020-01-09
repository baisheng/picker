import { Controller, Get, Param } from '@nestjs/common';

import { Permission } from '@app/common/generated-types';
import { Allow } from '@app/decorators/allow.decorator';
import { OptionService } from '@app/modules/options/option.service';

@Controller('options')
export class OptionController {

  constructor(
    private readonly optionService: OptionService,
  ) {
  }

  @Get(':type')
  @Allow(Permission.Owner)
  async index(@Param('type') type: any) {
    const allOption = await this.optionService.load();
    const foundOption = allOption[type];
    if (foundOption) {
      // if (type === 'minapp') {
      //   Reflect.deleteProperty(foundOption, 'config');
      // }
      return foundOption;
    }
  }

  @Get()
  all() {
    return this.optionService.load(true);
  }

  // @Get()
  // @HttpProcessor.handle('获取设置')
  // getOption(): Promise<Option> {
  //   return this.optionService.getOption();
  // }
  //
  // @Put()
  // @UseGuards(JwtAuthGuard)
  // @HttpProcessor.handle('修改设置')
  // putOption(@Body() option: Option): Promise<Option> {
  //   return this.optionService.putOption(option);
  // }
}
