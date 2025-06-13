import { BadRequestError, InternalServerError } from 'routing-controllers';
import { ValidationError, UniqueConstraintError } from 'sequelize';
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
}
