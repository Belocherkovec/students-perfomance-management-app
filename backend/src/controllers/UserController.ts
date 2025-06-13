import { Authorized, Body, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

import { CreateUserRoleDto } from '@/dtos';
import { UserDto } from '@/dtos/UserDto';
import { IUser } from '@/interfaces';
import { UserService } from '@/services';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Authorized('admin')
  @Get()
  async getAll(): Promise<UserDto[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() userData: IUser): Promise<UserDto> {
    return this.userService.createUser(userData);
  }

  @Post('/roles')
  async addRoleToUser(@Body() data: CreateUserRoleDto): Promise<{ success: boolean }> {
    await this.userService.addUserRole(data.userId, data.roleId);
    return { success: true };
  }
}
