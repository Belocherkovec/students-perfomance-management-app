import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { Group } from '@/models';

@Service()
export class GroupRepository {
  constructor(private sequelize: Sequelize) {}

  private get groupRepository() {
    return this.sequelize.getRepository<Group>(Group);
  }

  async getAll() {
    return this.groupRepository.findAll();
  }
}
