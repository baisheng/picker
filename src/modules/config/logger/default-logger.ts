import chalk from 'chalk';
import { BaseLogger, Logger, LogLevel } from '@app/modules/config/logger/base-logger';

const DEFAULT_CONTEXT = 'PICKER Server';

/**
 * @description
 * 默认的日志记录器，它使用可选的时间戳记录到控制台(stdout)。因为这个日志程序是
 * 默认的配置，你不需要在你的服务器配置显式指定它。
 * 如果您希望更改日志级别(默认为' LogLevel.Info ')或删除时间戳，可以指定它。
 *
 * @docsCategory Logger
 */
export class DefaultLogger implements BaseLogger {
  /** @internal */
  level: LogLevel = LogLevel.Info;
  private readonly timestamp: boolean;
  private defaultContext = DEFAULT_CONTEXT;
  private readonly localeStringOptions = {
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
  };
  private static originalLogLevel: LogLevel;

  constructor(options?: { level?: LogLevel; timestamp?: boolean }) {
    this.level = options && options.level != null ? options.level : LogLevel.Info;
    this.timestamp = options && options.timestamp !== undefined ? options.timestamp : true;
  }

  /**
   * @description
   * 在启动AppModule时隐藏Nest生成的信息层日志的解决方案。
   * 在“bootstrap()”函数中调用“NestFactory.create()”之前直接运行。
   *
   * See https://github.com/nestjs/nest/issues/1838
   * @internal
   */
  static hideNestBoostrapLogs(): void {
    const { logger } = Logger;
    if (logger instanceof DefaultLogger) {
      if (logger.level === LogLevel.Info) {
        this.originalLogLevel = LogLevel.Info;
        logger.level = LogLevel.Warn;
      }
    }
  }

  /**
   * @description
   * If the log level was changed by `hideNestBoostrapLogs()`, this method will restore the
   * original log level. To be run directly after the `NestFactory.create()` call in the
   * `bootstrap()` function.
   *
   * See https://github.com/nestjs/nest/issues/1838
   * @internal
   */
  static restoreOriginalLogLevel(): void {
    const { logger } = Logger;
    if (logger instanceof DefaultLogger && DefaultLogger.originalLogLevel !== undefined) {
      logger.level = DefaultLogger.originalLogLevel;
    }
  }

  setDefaultContext(defaultContext: string) {
    this.defaultContext = defaultContext;
  }

  error(message: string, context?: string, trace?: string | undefined): void {
    if (this.level >= LogLevel.Error) {
      this.logMessage(
        chalk.red(`error`),
        chalk.red(this.ensureString(message) + (trace ? `\n${trace}` : '')),
        context,
      );
    }
  }

  warn(message: string, context?: string): void {
    if (this.level >= LogLevel.Warn) {
      this.logMessage(chalk.yellow(`warn`), chalk.yellow(this.ensureString(message)), context);
    }
  }

  info(message: string, context?: string): void {
    if (this.level >= LogLevel.Info) {
      this.logMessage(chalk.blue(`info`), this.ensureString(message), context);
    }
  }

  verbose(message: string, context?: string): void {
    if (this.level >= LogLevel.Verbose) {
      this.logMessage(chalk.magenta(`verbose`), this.ensureString(message), context);
    }
  }

  debug(message: string, context?: string): void {
    if (this.level >= LogLevel.Debug) {
      this.logMessage(chalk.magenta(`debug`), this.ensureString(message), context);
    }
  }

  private logMessage(prefix: string, message: string, context?: string) {
    process.stdout.write(
      [prefix, this.logTimestamp(), this.logContext(context), message, '\n'].join(' '),
    );
  }

  private logContext(context?: string) {
    return chalk.cyan(`[${context || this.defaultContext}]`);
  }

  private logTimestamp() {
    if (this.timestamp) {
      const timestamp = new Date(Date.now()).toLocaleString(undefined, this.localeStringOptions);
      return chalk.gray(timestamp + ' -');
    } else {
      return '';
    }
  }

  private ensureString(message: string | object | any[]): string {
    return typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  }
}
