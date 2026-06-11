import { Platform } from 'react-native';
import axios from 'axios';
import { createMMKV } from 'react-native-mmkv';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Instance of MMKV for storage (with Web fallback)
export const storage = Platform.OS === 'web'
  ? {
      getString: (key: string) => localStorage.getItem(key),
      set: (key: string, value: string) => localStorage.setItem(key, value),
      remove: (key: string) => localStorage.removeItem(key)
    }
  : createMMKV();

const BASE_URL = __DEV__ 
  ? 'http://192.168.1.15:5005' // Substitua pelo seu IP local se estiver testando em device físico
  : 'https://api-siga.valtre.com.br';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para requisições
api.interceptors.request.use((config) => {
  const token = storage.getString('siga_logger_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para respostas (Tratamento de 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido -> Logout
      store.dispatch(logout());
      storage.remove('siga_logger_token');
    }
    return Promise.reject(error);
  }
);
