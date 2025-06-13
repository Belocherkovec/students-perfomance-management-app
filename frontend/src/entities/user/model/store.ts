import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {type IUser} from './types';


interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  updateUser: (partial: Partial<IUser>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      updateUser: (partial) =>
        set((state) => {
          if (state.user) {
            Object.assign(state.user, partial);
          }
        }),
      clearUser: () => set(() => ({ user: null })),
    })),
    {
      name: 'user-store',
    }
  )
);
