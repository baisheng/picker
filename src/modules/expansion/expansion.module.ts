/**
 * Expansion module.
 * @file Expansion 模块
 * @module module/expansion/module
 */

import { Module, HttpModule } from '@nestjs/common';
import { ExpansionController } from './expansion.controller';
import { StatisticService } from './expansion.service.statistic';

const services = [StatisticService];

@Module({
  imports: [HttpModule],
  controllers: [ExpansionController],
  providers: [
    ...services,
  ],
  exports: services,
})
export class ExpansionModule {}
