import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { groupApi } from '../api/groupApi';
import type { Group, CreateGroupData } from './types';

interface GroupState {
  groups: Group[];
  isLoading: boolean;
  error: string | null;

  loadGroups: () => Promise<void>;
  createGroup: (groupData: CreateGroupData) => Promise<void>;
  updateGroup: (id: number, groupData: Partial<CreateGroupData>) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
  getGroupById: (id: number) => Promise<Group>;
}

export const useGroupStore = create<GroupState>()(
  immer((set, get) => ({
    groups: [],
    isLoading: false,
    error: null,

    loadGroups: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const groups = await groupApi.getGroups();
        set(state => {
          state.groups = groups;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка загрузки групп';
        });
      }
    },

    createGroup: async (groupData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const newGroup = await groupApi.createGroup(groupData);
        set(state => {
          state.groups.push(newGroup);
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка создания группы';
        });
      }
    },

    updateGroup: async (id, groupData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const updatedGroup = await groupApi.updateGroup(id, groupData);
        set(state => {
          const index = state.groups.findIndex(g => g.id === id);
          if (index !== -1) {
            state.groups[index] = updatedGroup;
          }
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка обновления группы';
        });
      }
    },

    deleteGroup: async (id) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await groupApi.deleteGroup(id);
        set(state => {
          state.groups = state.groups.filter(g => g.id !== id);
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка удаления группы';
        });
      }
    },

    getGroupById: async (id: number): Promise<Group> => {
      try {
        // Сначала проверяем в кеше
        const cachedGroup = get().groups.find(g => g.id === id);
        if (cachedGroup) return cachedGroup;

        // Если нет в кеше, загружаем с сервера
        const group = await groupApi.getGroupById(id);
        return group;
      } catch (error) {
        throw new Error('Группа не найдена');
      }
    }
  }))
);