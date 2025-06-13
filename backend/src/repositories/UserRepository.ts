import bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

import { IUser } from '@/interfaces';
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

  async createUser(userData: IUser): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    return await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
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
}
