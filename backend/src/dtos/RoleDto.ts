import type { Role } from '@/models';

export class RoleDto {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.createdAt = role.createdAt;
    this.updatedAt = role.updatedAt;
  }
}
