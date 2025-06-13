import 'reflect-metadata';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import type { Action } from 'routing-controllers';
import { createExpressServer, useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { initializeDatabase } from '@/configs';
import { UserController, GroupController } from '@/controllers';
import { AuthController } from '@/controllers/AuthController';
import { ErrorHandler } from '@/middlewares';
import { checkAuthorization } from '@/utils';

async function bootstrap() {
  // 1. Инициализация базы данных
  await initializeDatabase();

  // 2. Настройка DI контейнера
  routingUseContainer(Container);

  // 3. Создание Express приложения с routing-controllers
  const app = createExpressServer({
    controllers: [UserController, GroupController, AuthController],
    middlewares: [express.json(), cors(), ErrorHandler],
    authorizationChecker: checkAuthorization,
    currentUserChecker: async (action: Action) => {
      return action.request.user; // Пользователь, добавленный в authorizationChecker
    },
    defaultErrorHandler: false,
    classTransformer: true,
    validation: true,
  });

  // Дополнительная middleware для обработки ошибок
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  app.use(bodyParser.json());

  return app;
}

export { bootstrap };
