import { Service } from 'typedi';

import { User } from '@/models';
import { UserRepository } from '@/repositories';

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.getAll();
    return users;
  }
}
