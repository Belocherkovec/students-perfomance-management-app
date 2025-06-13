import { Service } from 'typedi';

import { UserDto } from '@/dtos/UserDto';
import { IUser } from '@/interfaces';
import { UserRepository } from '@/repositories';

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.getAll();
    return users.map((user) => new UserDto(user));
  }

  async createUser(userData: IUser): Promise<UserDto> {
    const user = await this.userRepository.createUser(userData);
    return new UserDto(user);
  }
}
