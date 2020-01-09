import { LoggerService } from '@nestjs/common';

/**
 * @description
 * 有效日志级别的枚举。
 *
 * @docsCategory Logger
 */
export enum LogLevel {
  /**
   * @description
   * Log Errors only.
   */
  Error = 0,
  Warn = 1,
  Info = 2,
  Verbose = 3,
  Debug = 4,
}

/**
 * @description
 * BaseLogger 接口中定义的日志服务配置
 * @docsCategory Logger
 */
export interface BaseLogger {
  error(message: string, context?: string, trace?: string): void;
  warn(message: string, context?: string): void;
  info(message: string, context?: string): void;
  verbose(message: string, context?: string): void;
  debug(message: string, context?: string): void;
}

const noopLogger: BaseLogger = {
  error() { /* */ },
  warn() { /* */ },
  info() { /* */ },
  verbose() { /* */ },
  debug() { /* */ },
};

/**
 * @description
 * ## Implementing a custom logger
 *
 * A custom logger can be passed to the `logger` config option by creating a class which implements the
 * {@link BaseLogger} interface. For example, here is how you might go about implementing a logger which
 * logs to a file:
 *
 * @example
 * ```ts
 * import { BaseLogger } from '\@base/core';
 * import fs from 'fs';
 *
 * // A simple custom logger which writes all logs to a file.
 * export class SimpleFileLogger implements BaseLogger {
 *     private logfile: fs.WriteStream;
 *
 *     constructor(logfileLocation: string) {
 *         this.logfile = fs.createWriteStream(logfileLocation, { flags: 'w' });
 *     }
 *
 *     error(message: string, context?: string) {
 *         this.logfile.write(`ERROR: [${context}] ${message}\n`);
 *     }
 *     warn(message: string, context?: string) {
 *         this.logfile.write(`WARN: [${context}] ${message}\n`);
 *     }
 *     info(message: string, context?: string) {
 *         this.logfile.write(`INFO: [${context}] ${message}\n`);
 *     }
 *     verbose(message: string, context?: string) {
 *         this.logfile.write(`VERBOSE: [${context}] ${message}\n`);
 *     }
 *     debug(message: string, context?: string) {
 *         this.logfile.write(`DEBUG: [${context}] ${message}\n`);
 *     }
 * }
 *
 * // in the BaseConfig
 * export const config = {
 *     // ...
 *     logger: new SimpleFileLogger('server.log'),
 * }
 * ```
 *
 * @docsCategory Logger
 */
export class Logger implements LoggerService {
  private static _instance: typeof Logger = Logger;
  private static _logger: BaseLogger;

  static get logger(): BaseLogger {
    return this._logger || noopLogger;
  }

  private get instance(): typeof Logger {
    const { _instance } = Logger;
    return _instance;
  }

  /** @internal */
  static useLogger(logger: BaseLogger) {
    Logger._logger = logger;
  }

  /** @internal */
  error(message: any, trace?: string, context?: string): any {
    this.instance.error(message, context, trace);
  }

  /** @internal */
  warn(message: any, context?: string): any {
    this.instance.warn(message, context);
  }

  /** @internal */
  log(message: any, context?: string): any {
    this.instance.info(message, context);
  }

  /** @internal */
  verbose(message: any, context?: string): any {
    this.instance.verbose(message, context);
  }

  /** @internal */
  debug(message: any, context?: string): any {
    this.instance.debug(message, context);
  }

  static error(message: string, context?: string, trace?: string): void {
    Logger.logger.error(message, context, trace);
  }

  static warn(message: string, context?: string): void {
    Logger.logger.warn(message, context);
  }

  static info(message: string, context?: string): void {
    Logger.logger.info(message, context);
  }

  static verbose(message: string, context?: string): void {
    Logger.logger.verbose(message, context);
  }

  static debug(message: string, context?: string): void {
    Logger.logger.debug(message, context);
  }
}
