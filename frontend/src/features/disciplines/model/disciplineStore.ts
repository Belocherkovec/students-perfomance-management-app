import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { disciplineApi } from '../api/disciplineApi';
import type { Discipline, CreateDisciplineData } from './types';

interface DisciplineState {
  disciplines: Discipline[];
  isLoading: boolean;
  error: string | null;

  loadDisciplines: () => Promise<void>;
  createDiscipline: (disciplineData: CreateDisciplineData) => Promise<void>;
  updateDiscipline: (id: number, disciplineData: Partial<CreateDisciplineData>) => Promise<void>;
  deleteDiscipline: (id: number) => Promise<void>;
  getDisciplineById: (id: number) => Promise<Discipline>;
}

export const useDisciplineStore = create<DisciplineState>()(
  immer((set, get) => ({
    disciplines: [],
    isLoading: false,
    error: null,

    loadDisciplines: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const disciplines = await disciplineApi.getDisciplines();
        set(state => {
          state.disciplines = disciplines;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка загрузки дисциплин';
        });
      }
    },

    createDiscipline: async (disciplineData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const newDiscipline = await disciplineApi.createDiscipline(disciplineData);
        set(state => {
          state.disciplines.push(newDiscipline);
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка создания дисциплины';
        });
      }
    },

    updateDiscipline: async (id, disciplineData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const updatedDiscipline = await disciplineApi.updateDiscipline(id, disciplineData);
        set(state => {
          const index = state.disciplines.findIndex(d => d.id === id);
          if (index !== -1) {
            state.disciplines[index] = updatedDiscipline;
          }
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка обновления дисциплины';
        });
      }
    },

    deleteDiscipline: async (id) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await disciplineApi.deleteDiscipline(id);
        set(state => {
          state.disciplines = state.disciplines.filter(d => d.id !== id);
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.isLoading = false;
          state.error = 'Ошибка удаления дисциплины';
        });
      }
    },

    getDisciplineById: async (id: number): Promise<Discipline> => {
      try {
        // Сначала проверяем в кеше
        const cachedDiscipline = get().disciplines.find(d => d.id === id);
        if (cachedDiscipline) return cachedDiscipline;

        // Если нет в кеше, загружаем с сервера
        const discipline = await disciplineApi.getDisciplineById(id);
        return discipline;
      } catch (error) {
        throw new Error('Дисциплина не найдена');
      }
    }
  }))
);