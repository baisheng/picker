import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';

import { Logger } from './base-logger';

const context = 'TypeORM';

/**
 * 一种用于TypeORM的自定义记录器，委托记录器服务。
 */
export class TypeOrmLogger implements TypeOrmLoggerInterface {
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    switch (level) {
      case 'info':
        Logger.info(message, context);
        break;
      case 'log':
        Logger.verbose(message, context);
        break;
      case 'warn':
        Logger.warn(message, context);
        break;
    }
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    Logger.info(message, context);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    Logger.debug(`Query: "${query}" -- [${parameters}]`, context);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    Logger.error(`Query error: ${error}, "${query}" -- [${parameters}]`, context);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    Logger.warn(`Slow query (${time}): "${query}" -- [${parameters}]`, context);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    Logger.info(message, context);
  }
}
