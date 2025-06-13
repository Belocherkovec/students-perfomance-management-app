import { Body, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

import { CreateRoleDto, RoleDto } from '@/dtos';
import { RoleService } from '@/services';

@JsonController('/roles')
@Service()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async getAll(): Promise<RoleDto[]> {
    return this.roleService.getAllRoles();
  }

  @Post()
  async createRole(@Body() data: CreateRoleDto) {
    return this.roleService.createRole(data);
  }
}
