import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  private logError(error: HttpError | Error) {
    const separator = chalk.yellow('='.repeat(80));
    console.error(separator);

    if (error instanceof HttpError) {
      console.error(chalk.red.bold(`❌ [HTTP ERROR ${error.httpCode}] ${error.name}`));
      console.error(chalk.red(`🕒 ${new Date().toISOString()}`));
      console.error(chalk.red.bold('Message:'), error.message);
    } else {
      console.error(chalk.red.bold('❌ [UNHANDLED ERROR]'));
      console.error(chalk.red.bold('Name:'), error.name);
      console.error(chalk.red.bold('Message:'), error.message);
    }

    if (error.stack) {
      console.error('\n' + chalk.blue.bold('Stack trace:'));
      console.error(chalk.gray(error.stack));
    }

    console.error(separator + '\n');
  }

  error(error: Error, request: Request, response: Response, next: NextFunction) {
    this.logError(error);

    // Обработка HTTP ошибок
    if (error instanceof HttpError) {
      response.status(error.httpCode).json({
        status: error.httpCode,
        message: error.message,
      });
      return;
    }

    // Обработка непредвиденных ошибок
    response.status(500).json({
      status: 500,
      message: 'Внутренняя ошибка сервера',
    });
  }
}
