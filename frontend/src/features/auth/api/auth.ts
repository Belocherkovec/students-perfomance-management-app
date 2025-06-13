import { baseApi } from '@/shared/api/base';
import type { Tokens, LoginRequest } from '../model/types';

export const login = async (credentials: LoginRequest): Promise<Tokens> => {
  const response = await baseApi.post<Tokens>('/login', credentials);
  return response.data;
};