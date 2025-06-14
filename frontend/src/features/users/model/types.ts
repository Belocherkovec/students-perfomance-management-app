export interface User {
  id: number;
  name: string;
  surname: string;
  patronymic: string | null;
  login: string;
  email: string | null;
  group_id: number | null;
  is_blocked: boolean;
  roles: string[];
}

export interface Group {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface CreateUserData {
  name: string;
  surname: string;
  patronymic?: string;
  login: string;
  email?: string;
  group_id?: number | null;
  is_blocked?: boolean;
  roles?: string[];
}