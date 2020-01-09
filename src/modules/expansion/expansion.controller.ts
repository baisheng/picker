/**
 * Expansion controller.
 * @file 扩展模块控制器
 * @description 分发 -> 统计/常量/数据库备份
 * @module module/expansion/controller
 */

import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { StatisticService, ITodayStatistic } from './expansion.service.statistic';

@Controller('expansion')
export class ExpansionController {

  constructor(
    private readonly statisticService: StatisticService,
  ) {}

  @Get('statistic')
  @HttpProcessor.handle('获取统计概览')
  getSystemStatistics(): Promise<ITodayStatistic> {
    return this.statisticService.getStatistic();
  }
}
