import bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { UniqueConstraintError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { IUser } from '@/interfaces';
import { Role, User, UserRole } from '@/models';

@Service()
export class UserRepository {
  constructor(private sequelize: Sequelize) {}

  private get userRepository() {
    return this.sequelize.getRepository<User>(User);
  }

  private get roleRepository() {
    return this.sequelize.getRepository<Role>(Role);
  }

  private get userRoleRepository() {
    return this.sequelize.getRepository<UserRole>(UserRole);
  }

  async getAll() {
    return this.userRepository.findAll();
  }

  async createUser(userData: IUser): Promise<User> {
    // Предварительная проверка уникальности логина
    const existingUser = await this.userRepository.findOne({
      where: { login: userData.login },
    });

    if (existingUser) {
      throw new BadRequestError(`Пользователь с логином ${userData.login} уже существует`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    return await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async deleteUser(id: number): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      // Сначала удаляем связи с ролями
      await this.userRoleRepository.destroy({
        where: { user_id: id },
        transaction,
      });

      // Затем удаляем самого пользователя
      const deletedCount = await this.userRepository.destroy({
        where: { id },
        transaction,
      });

      await transaction.commit();
      return deletedCount > 0;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateUser(id: number, updateData: Partial<IUser>): Promise<User | null> {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userRepository.findByPk(id, { transaction });
      if (!user) {
        await transaction.commit();
        return null;
      }

      // Обновление пароля при необходимости
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }

      // Обновляем основные данные
      const updatedUser = await user.update(updateData, { transaction });

      await transaction.commit();

      // Возвращаем обновленного пользователя с ролями
      return this.userRepository.findByPk(id, {
        include: [Role],
        transaction,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUserByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const user = await this.userRepository.findByPk(userId, {
      include: [Role],
    });

    return user?.roles || [];
  }

  async addRoleToUser(userId: number, roleId: number): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      // Проверка существования с блокировкой
      const [user, role] = await Promise.all([
        this.userRepository.findByPk(userId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
        this.roleRepository.findByPk(roleId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
      ]);

      if (!user) {
        throw new NotFoundError(`Пользователь с ID ${userId} не найден`);
      }
      if (!role) {
        throw new NotFoundError(`Роль с ID ${roleId} не найдена`);
      }

      // Создание связи
      const [, created] = await this.userRoleRepository.findOrCreate({
        where: { user_id: userId, role_id: roleId },
        defaults: { user_id: userId, role_id: roleId },
        transaction,
      });

      if (!created) {
        throw new BadRequestError('Эта роль уже назначена пользователю');
      }

      await transaction.commit();
    } catch (error: unknown) {
      // Явно указываем тип unknown
      await transaction.rollback();

      // Проверяем тип ошибки
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }

      // Обработка ошибок Sequelize
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestError('Эта роль уже назначена пользователю');
      }

      // Неизвестные ошибки
      console.error('Неожиданная ошибка:', error);
      throw new Error('Произошла непредвиденная ошибка');
    }
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.userRoleRepository.destroy({
      where: { user_id: userId, role_id: roleId },
    });
  }

  async setUserRoles(userId: number, roleIds: number[]): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      // Удаляем все текущие роли
      await this.userRoleRepository.destroy({
        where: { user_id: userId },
        transaction,
      });

      // Добавляем новые роли
      const records = roleIds.map((roleId) => ({ user_id: userId, role_id: roleId }));
      await this.userRoleRepository.bulkCreate(records, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUserWithRoles(login: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { login },
      include: [Role],
    });
  }
}
