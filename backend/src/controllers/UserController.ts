import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

import { UserService } from '@/services';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAllUsers();
  }
}
