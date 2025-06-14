import type { Role } from '@/models';

export class RoleDto {
  id: number;
  name: string;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
  }
}
