import { Authorized, Body, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

import { UserDto } from '@/dtos/UserDto';
import { IUser } from '@/interfaces';
import { UserService } from '@/services';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Authorized()
  @Get()
  async getAll(): Promise<UserDto[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() userData: IUser): Promise<UserDto> {
    return this.userService.createUser(userData);
  }
}
