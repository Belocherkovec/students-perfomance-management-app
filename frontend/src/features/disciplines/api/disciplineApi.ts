import { baseApi } from '@/shared/api/base';
import type { Discipline, CreateDisciplineData } from '../model/types';

export const disciplineApi = {
  getDisciplines: async (): Promise<Discipline[]> => {
    const response = await baseApi.get<Discipline[]>('/disciplines');
    return response.data;
  },

  getDisciplineById: async (id: number): Promise<Discipline> => {
    const response = await baseApi.get<Discipline>(`/disciplines/${id}`);
    return response.data;
  },

  createDiscipline: async (disciplineData: CreateDisciplineData): Promise<Discipline> => {
    const response = await baseApi.post<Discipline>('/disciplines', disciplineData);
    return response.data;
  },

  updateDiscipline: async (id: number, disciplineData: Partial<CreateDisciplineData>): Promise<Discipline> => {
    const response = await baseApi.patch<Discipline>(`/disciplines/${id}`, disciplineData);
    return response.data;
  },

  deleteDiscipline: async (id: number): Promise<void> => {
    await baseApi.delete(`/disciplines/${id}`);
  }
};