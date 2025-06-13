import jwt from 'jsonwebtoken';
import type { Action } from 'routing-controllers';
import { UnauthorizedError } from 'routing-controllers';
import { Container } from 'typedi';

import { UserRepository } from '@/repositories';

export const checkAuthorization = async (action: Action, roles: string[]): Promise<boolean> => {
  // 1. Извлечение токена из заголовка
  const authorizationHeader = action.request.headers['authorization'];
  if (!authorizationHeader) {
    throw new UnauthorizedError('Требуется авторизация');
  }

  // 2. Проверка типа токена
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Неверный формат токена');
  }

  // 3. Верификация токена
  const accessSecret = process.env.JWT_ACCESS_SECRET || '';
  let payload: any;

  try {
    payload = jwt.verify(token, accessSecret);
  } catch (err) {
    throw new UnauthorizedError('Недействительный токен');
  }

  // 4. Получение пользователя из базы данных
  const userRepository = Container.get(UserRepository);
  const user = await userRepository.getUserById(payload.userId);

  if (!user) {
    throw new UnauthorizedError('Пользователь не найден');
  }

  // // 4. Проверка ролей (если указаны)
  // if (roles.length > 0) {
  //   const hasRequiredRole = roles.some(role => user.roles.includes(role));
  //   if (!hasRequiredRole) {
  //     throw new UnauthorizedError('Недостаточно прав');
  //   }
  // }

  // 5. Сохраняем пользователя в запросе для последующего использования
  action.request.user = user;
  return true;
};
