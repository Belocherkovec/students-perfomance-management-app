import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { userApi } from '../api/userApi';
import type { User, Role, CreateUserData } from './types';

interface UserState {
  users: User[];
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  selectedUser: User | null;

  loadUsers: () => Promise<void>;
  loadRoles: () => Promise<void>;
  selectUser: (user: User | null) => void;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: number, userData: Partial<CreateUserData>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  // Добавляем отсутствующий метод
  getUserById: (id: number) => Promise<User>;
}

export const useUserStore = create<UserState>()(
  immer((set, get) => ({
    users: [],
    groups: [],
    roles: [],
    isLoading: false,
    error: null,
    selectedUser: null,

    loadUsers: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const users = await userApi.getUsers();
        set(state => {
          state.users = users;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка загрузки пользователей';
        });
      }
    },

    loadRoles: async () => {
      try {
        const roles = await userApi.getRoles();
        set(state => {
          state.roles = roles;
        });
      } catch (error) {
        console.error('Ошибка загрузки ролей:', error);
      }
    },

    selectUser: (user) => {
      set(state => {
        state.selectedUser = user;
      });
    },

    createUser: async (userData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const newUser = await userApi.createUser(userData);
        set(state => {
          state.users.push(newUser);
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка создания пользователя';
        });
      }
    },

    updateUser: async (id, userData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const updatedUser = await userApi.updateUser(id, userData);
        set(state => {
          const index = state.users.findIndex(u => u.id === id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка обновления пользователя';
        });
      }
    },

    deleteUser: async (id) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await userApi.deleteUser(id);
        set(state => {
          state.users = state.users.filter(u => u.id !== id);
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка удаления пользователя';
        });
      }
    },

    // Добавляем реализацию отсутствующего метода
    getUserById: async (id: number): Promise<User> => {
      try {
        // Сначала проверяем в кеше
        const cachedUser = get().users.find(u => u.id === id);
        if (cachedUser) return cachedUser;

        // Если нет в кеше, загружаем с сервера
        const user = await userApi.getUserById(id);
        return user;
      } catch (error) {
        throw new Error('Пользователь не найден');
      }
    }
  }))
);