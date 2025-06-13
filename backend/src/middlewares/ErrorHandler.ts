import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware, HttpError } from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  private logError(error: unknown) {
    const separator = chalk.yellow('='.repeat(80));
    console.error(separator);

    if (error instanceof HttpError) {
      console.error(chalk.red.bold(`❌ [HTTP ERROR ${error.httpCode}]`));
      console.error(chalk.red(`🕒 ${new Date().toISOString()}`));
      console.error(chalk.red.bold('Message:'), error.message);

      if (error.stack) {
        console.error('\n' + chalk.blue.bold('Stack trace:'));
        console.error(chalk.gray(error.stack));
      }
    } else if (error instanceof Error) {
      console.error(chalk.red.bold('❌ [UNHANDLED ERROR]'));
      console.error(chalk.red.bold('Name:'), error.name);
      console.error(chalk.red.bold('Message:'), error.message);

      if (error.stack) {
        console.error('\n' + chalk.blue.bold('Stack trace:'));
        console.error(chalk.gray(error.stack));
      }
    } else {
      console.error(chalk.red.bold('❌ [UNKNOWN ERROR TYPE]'));
      console.error(chalk.red(JSON.stringify(error)));
    }

    console.error(separator + '\n');
  }

  error(error: unknown, request: Request, response: Response, next: NextFunction) {
    // Логируем ошибку
    this.logError(error);

    // Обработка HTTP ошибок
    if (error instanceof HttpError) {
      response.status(error.httpCode).json({
        status: error.httpCode,
        message: error.message,
      });
      return;
    }

    // Обработка остальных ошибок
    const status = 500;
    let message = 'Internal Server Error';

    if (error instanceof Error) {
      message = error.message;
    }

    response.status(status).json({
      status,
      message,
    });
  }
}
