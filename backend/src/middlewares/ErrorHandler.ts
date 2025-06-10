// src/middlewares/ErrorHandler.ts
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/NotFoundError';
import {Service} from "typedi";

@Middleware({ type: 'after' })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: NextFunction) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        status: 404,
        message: error.message
      });
    } else {
      response.status(error.httpCode || 500).json({
        status: error.httpCode || 500,
        message: error.message || 'Internal Server Error'
      });
    }
  }
}