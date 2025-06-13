import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { login } from '../api/auth';
import type { LoginRequest } from './types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean; // Флаг инициализации
  isError: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  resetError: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  initialize: () => void; // Метод для завершения инициализации
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false, // Начальное состояние - не инициализирован
      isError: false,

      login: async (credentials) => {
        set((state) => {
          state.isLoading = true;
          state.isError = false;
        });

        try {
          const tokens = await login(credentials);
          set((state) => {
            state.accessToken = tokens.accessToken;
            state.refreshToken = tokens.refreshToken;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.isError = true;
          });

          throw error;
        }
      },

      logout: () => set((state) => {
        state.accessToken = null;
        state.refreshToken = null;
      }),

      resetError: () => set((state) => {
        state.isError = false;
      }),

      setTokens: (accessToken, refreshToken) => set((state) => {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      }),

      initialize: () => set((state) => {
        state.isInitialized = true;
      }),
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }),
      // Обработчик завершения гидратации
      onRehydrateStorage: () => (state) => {
        state?.initialize();
      },
    }
  )
);