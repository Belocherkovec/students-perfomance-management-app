export interface IUser {
  id?: number;
  name: string;
  surname: string;
  patronymic?: string | null;
  login: string;
  email?: string | null;
  password: string;
  group_id?: number | null;
  is_blocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
