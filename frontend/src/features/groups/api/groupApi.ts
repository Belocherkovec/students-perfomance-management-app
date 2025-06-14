import { baseApi } from '@/shared/api/base';
import type { Group, CreateGroupData } from '../model/types';

export const groupApi = {
  getGroups: async (): Promise<Group[]> => {
    const response = await baseApi.get<Group[]>('/groups');
    return response.data;
  },

  getGroupById: async (id: number): Promise<Group> => {
    const response = await baseApi.get<Group>(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (groupData: CreateGroupData): Promise<Group> => {
    const response = await baseApi.post<Group>('/groups', groupData);
    return response.data;
  },

  updateGroup: async (id: number, groupData: Partial<CreateGroupData>): Promise<Group> => {
    const response = await baseApi.patch<Group>(`/groups/${id}`, groupData);
    return response.data;
  },

  deleteGroup: async (id: number): Promise<void> => {
    await baseApi.delete(`/groups/${id}`);
  }
};