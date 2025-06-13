import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware, HttpError } from 'routing-controllers';
import { Service } from 'typedi';

interface ApiError extends HttpError {
  errors?: any[];
}

interface ErrorResponse {
  status: number;
  message: string;
  errors?: any[];
}

@Middleware({ type: 'after' })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  private logError(error: ApiError | Error) {
    const separator = chalk.yellow('='.repeat(80));
    console.error(separator);

    if ('httpCode' in error) {
      console.error(chalk.red.bold(`❌ [HTTP ERROR ${error.httpCode}] ${error.name}`));
      console.error(chalk.red(`🕒 ${new Date().toISOString()}`));
      console.error(chalk.red.bold('Message:'), error.message);

      if (error.errors) {
        console.error(chalk.yellow.bold('Validation errors:'));
        console.error(JSON.stringify(error.errors, null, 2));
      }
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

    const errorResponse: ErrorResponse = {
      status: 500,
      message: 'Внутренняя ошибка сервера',
    };

    // Обработка HTTP ошибок
    if ('httpCode' in error) {
      const httpError = error as ApiError;
      errorResponse.status = httpError.httpCode;
      errorResponse.message = httpError.message;

      // Обработка ошибок валидации
      if (httpError.httpCode === 400 && httpError.errors) {
        errorResponse.message = 'Ошибка валидации';
        errorResponse.errors = this.formatValidationErrors(httpError.errors);
      }
    }

    response.status(errorResponse.status).json(errorResponse);
  }

  private formatValidationErrors(errors: any[]): any[] {
    return errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
      ...(error.children?.length && {
        children: this.formatValidationErrors(error.children),
      }),
    }));
  }
}
