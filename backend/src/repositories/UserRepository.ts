import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { User } from '@/models';

@Service()
export class UserRepository {
  constructor(private sequelize: Sequelize) {}

  private get userRepository() {
    return this.sequelize.getRepository<User>(User);
  }

  async getAll() {
    return this.userRepository.findAll();
  }
}
