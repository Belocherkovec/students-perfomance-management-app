import { baseApi } from '@/shared/api/base';
import type { User, CreateUserData, Group, Role } from '../model/types';

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await baseApi.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await baseApi.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await baseApi.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<CreateUserData>): Promise<User> => {
    const response = await baseApi.patch<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await baseApi.delete(`/users/${id}`);
  },

  // Мокированные данные для групп
  getGroups: async (): Promise<Group[]> => {
    // В реальном приложении:
    // return baseApi.get<Group[]>('/groups').then(res => res.data);

    return Promise.resolve([
      { id: 1, name: 'ИСТ-101' },
      { id: 2, name: 'ПИ-202' },
      { id: 3, name: 'МТ-303' },
    ]);
  },

  // Мокированные данные для ролей
  getRoles: async (): Promise<Role[]> => {
    // В реальном приложении:
    // return baseApi.get<Role[]>('/roles').then(res => res.data);

    return Promise.resolve([
      { id: 1, name: 'admin' },
      { id: 2, name: 'teacher' },
      { id: 3, name: 'student' },
      { id: 4, name: 'moderator' },
    ]);
  }
};