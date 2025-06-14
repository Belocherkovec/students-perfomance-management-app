import { BadRequestError, InternalServerError } from 'routing-controllers';
import { ValidationError, UniqueConstraintError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { IRole } from '@/interfaces';
import { Discipline } from '@/models';

@Service()
export class DisciplineRepository {
  constructor(private sequelize: Sequelize) {}

  private get repository() {
    return this.sequelize.getRepository(Discipline);
  }

  async getDisciplines(): Promise<Discipline[]> {
    return this.repository.findAll();
  }

  async addDiscipline(data: IRole): Promise<Discipline> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      // Обработка дубликатов
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestError(`Дисциплина '${data.name}' уже существует`);
      }

      // Обработка ошибок валидации
      if (error instanceof ValidationError) {
        const messages = error.errors.map((err) => err.message).join(', ');
        throw new BadRequestError(`Ошибка валидации: ${messages}`);
      }

      // Логирование неожиданных ошибок
      console.error('Ошибка при создании роли:', error);
      throw new InternalServerError('Не удалось создать дисциплину');
    }
  }
}
