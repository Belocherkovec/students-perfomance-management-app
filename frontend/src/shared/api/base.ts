import axios from 'axios';
import { useAuthStore } from '@/features/auth/model/store.ts';

// Определяем базовый URL в зависимости от среды выполнения
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // В продакшене используем значение из .env
    return import.meta.env.VITE_API_URL || 'https://your-production-api.com';
  }

  // В режиме разработки:
  // Если указан прокси в vite.config.ts, используем относительный путь
  // Если не указан, используем значение из .env для разработки
  return import.meta.env.VITE_USE_PROXY === 'true'
    ? '/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

export const baseApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
baseApi.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});