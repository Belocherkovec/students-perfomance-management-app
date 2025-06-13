import type { User } from '@/models';

export class UserDto {
  id: number;
  name: string;
  surname: string;
  patronymic: string | null;
  login: string;
  email: string | null;
  group_id: number | null;
  is_blocked: boolean;
  roles: string[];

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic || null;
    this.login = user.login;
    this.email = user.email || null;
    this.group_id = user.group_id || null;
    this.is_blocked = user.is_blocked;
    this.roles = user.rolesList;
  }
}
