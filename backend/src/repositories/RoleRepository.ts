import { BadRequestError, InternalServerError, NotFoundError } from 'routing-controllers';
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { IRole } from '@/interfaces';
import { Role } from '@/models';

@Service()
export class RoleRepository {
  constructor(private sequelize: Sequelize) {}

  private get roleRepository() {
    return this.sequelize.getRepository(Role);
  }

  async getRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async addRole(roleData: IRole): Promise<Role> {
    try {
      return await this.roleRepository.create(roleData);
    } catch (error) {
      // Обработка дубликатов
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestError(`Роль '${roleData.name}' уже существует`);
      }

      // Обработка ошибок валидации
      if (error instanceof ValidationError) {
        const messages = error.errors.map((err) => err.message).join(', ');
        throw new BadRequestError(`Ошибка валидации: ${messages}`);
      }

      // Логирование неожиданных ошибок
      console.error('Ошибка при создании роли:', error);
      throw new InternalServerError('Не удалось создать роль');
    }
  }

  async updateRole(roleId: number, updateData: Partial<IRole>): Promise<Role> {
    try {
      const role = await this.roleRepository.findByPk(roleId);
      if (!role) {
        throw new NotFoundError(`Роль с ID ${roleId} не найдена`);
      }

      // Проверка уникальности нового имени
      if (updateData.name && updateData.name !== role.name) {
        const existingRole = await this.roleRepository.findOne({
          where: { name: updateData.name },
        });

        if (existingRole) {
          throw new BadRequestError(`Роль '${updateData.name}' уже существует`);
        }
      }

      return await role.update(updateData);
    } catch (error) {
      // Обработка ошибок валидации Sequelize
      if (error instanceof ValidationError) {
        const messages = error.errors.map((err) => err.message).join(', ');
        throw new BadRequestError(`Ошибка валидации: ${messages}`);
      }

      // Пробрасываем кастомные ошибки (NotFoundError, BadRequestError)
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }

      // Логирование прочих ошибок
      console.error(`Ошибка обновления роли ${roleId}:`, error);
      throw new InternalServerError('Не удалось обновить роль');
    }
  }

  async deleteRole(roleId: number): Promise<void> {
    try {
      const role = await this.roleRepository.findByPk(roleId);
      if (!role) {
        throw new NotFoundError(`Роль с ID ${roleId} не найдена`);
      }

      await role.destroy();
    } catch (error) {
      // Обработка ошибки внешнего ключа (если роль используется)
      if (error instanceof ForeignKeyConstraintError) {
        throw new BadRequestError('Роль используется в системе и не может быть удалена');
      }

      if (error instanceof NotFoundError) {
        throw error;
      }

      console.error(`Ошибка удаления роли ${roleId}:`, error);
      throw new InternalServerError('Не удалось удалить роль');
    }
  }
}
