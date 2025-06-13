import { Service } from 'typedi';

import { CreateRoleDto, RoleDto } from '@/dtos';
import { RoleRepository } from '@/repositories/RoleRepository';

@Service()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async getAllRoles(): Promise<RoleDto[]> {
    const roles = await this.roleRepository.getRoles();
    return roles.map((role) => new RoleDto(role));
  }

  async createRole(roleData: CreateRoleDto): Promise<RoleDto> {
    const role = await this.roleRepository.addRole(roleData);
    return new RoleDto(role);
  }
}
