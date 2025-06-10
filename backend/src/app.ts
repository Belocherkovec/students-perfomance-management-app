import 'reflect-metadata';
import {createExpressServer, useContainer as routingUseContainer} from 'routing-controllers';
import { Container } from 'typedi';
import { initializeDatabase } from './config/database';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import {ErrorHandler} from "./middlewares/ErrorHandler";

async function bootstrap() {
  // 1. Инициализация базы данных
  await initializeDatabase();

  // 2. Настройка DI контейнера
  routingUseContainer(Container);

  // 3. Создание Express приложения с routing-controllers
  const app = createExpressServer({
    controllers: [__dirname + '/controllers/*.ts'],
    middlewares: [express.json(), cors(), ErrorHandler],
    defaultErrorHandler: false,
    classTransformer: true,
    validation: true,
  });

  // Дополнительная middleware для обработки ошибок
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  })

  app.use(bodyParser.json())

  return app;
}

export { bootstrap };