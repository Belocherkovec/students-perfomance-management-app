import { BadRequestError, NotFoundError } from 'routing-controllers';
import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { CreateDisciplineDto } from '@/dtos/DisciplineDtos';
import { Discipline, Group, GroupDisciplines } from '@/models';

@Service()
export class GroupRepository {
  constructor(private sequelize: Sequelize) {}

  private get groupRepository() {
    return this.sequelize.getRepository<Group>(Group);
  }

  private get disciplineRepository() {
    return this.sequelize.getRepository<Discipline>(Discipline);
  }

  private get groupDisciplineRepository() {
    return this.sequelize.getRepository<GroupDisciplines>(GroupDisciplines);
  }

  async getAll() {
    return this.groupRepository.findAll({
      include: [Discipline],
    });
  }

  async getById(id: number) {
    return this.groupRepository.findOne({ where: { id } });
  }

  async create(data: CreateDisciplineDto) {
    return this.groupRepository.create(data);
  }

  async update(id: number, data: CreateDisciplineDto) {
    const group = await this.groupRepository.findOne({ where: { id } });

    if (!group) {
      return null;
    }

    return await group.update(data);
  }

  async delete(id: number) {
    const transaction = await this.sequelize.transaction();

    try {
      await this.groupDisciplineRepository.destroy({
        where: { group_id: id },
        transaction,
      });

      const deletedCount = await this.groupRepository.destroy({
        where: { id },
        transaction,
      });

      await transaction.commit();

      return deletedCount > 0;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async addDiscipline(groupId: number, disciplineId: number) {
    const transaction = await this.sequelize.transaction();

    try {
      // Проверка существования с блокировкой
      const [group, discipline] = await Promise.all([
        this.groupRepository.findByPk(groupId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
        this.disciplineRepository.findByPk(disciplineId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
      ]);

      if (!group) {
        throw new NotFoundError(`Группа с ID ${groupId} не найден`);
      }

      if (!discipline) {
        throw new NotFoundError(`Дисциплина с ID ${disciplineId} не найдена`);
      }

      const [, created] = await this.groupDisciplineRepository.findOrCreate({
        where: { group_id: groupId, discipline_id: disciplineId },
        defaults: { group_id: groupId, discipline_id: disciplineId },
        transaction,
      });

      if (!created) {
        throw new BadRequestError('Эта дисциплина уже закреплена за группой');
      }
    } catch (err) {
      await transaction.commit();
      throw err;
    }
  }

  async removeDiscipline(groupId: number, disciplineId: number) {
    await this.groupDisciplineRepository.destroy({
      where: { group_id: groupId, discipline_id: disciplineId },
    });
  }
}
