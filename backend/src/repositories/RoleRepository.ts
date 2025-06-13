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

  async addRole(role: IRole): Promise<Role> {
    return this.roleRepository.create(role);
  }
}
