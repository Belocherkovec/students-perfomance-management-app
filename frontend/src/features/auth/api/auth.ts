import { baseApi } from '@/shared/api/base';
import type { LoginResponse, LoginRequest } from '../model/types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await baseApi.post<LoginResponse>('/login', credentials);
  return response.data;
};