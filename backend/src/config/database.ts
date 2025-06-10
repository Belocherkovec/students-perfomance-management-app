import 'dotenv/config';
import { Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';

import { Todo } from '@/models/Todo';

export const initializeDatabase = async () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    models: [Todo],
    logging: false,
  });

  // Регистрируем экземпляр Sequelize в контейнере
  Container.set(Sequelize, sequelize);

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connected');
    return sequelize;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};
