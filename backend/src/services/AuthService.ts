import jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';

import { User } from '@/models';
import { UserRepository } from '@/repositories';

@Service()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.getUserByLogin(login);
    if (!user) {
      throw new UnauthorizedError('Неверный логин или пароль');
    }

    const isPasswordValid = await this.userRepository.comparePassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Неверный логин или пароль');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const secret = process.env.JWT_REFRESH_SECRET || 'ваш-секретный-ключ-для-refresh-токена';
    try {
      const decoded = jwt.verify(refreshToken, secret) as { userId: number; login: string };
      const user = await this.userRepository.getUserById(decoded.userId);
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      }
      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (err) {
      throw new UnauthorizedError('Недействительный refresh токен');
    }
  }

  private generateAccessToken(user: User): string {
    const secret = process.env.JWT_ACCESS_SECRET || 'ваш-секретный-ключ-для-access-токена';
    const payload = {
      userId: user.id,
      login: user.login,
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  private generateRefreshToken(user: User): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'ваш-секретный-ключ-для-refresh-токена';
    const payload = {
      userId: user.id,
      login: user.login,
    };
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }
}
