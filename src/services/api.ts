import axios from 'axios';
// import { MMKV } from 'react-native-mmkv';
import { router } from 'expo-router';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

import { storage } from './storage';
const BASE_URL = __DEV__
  ? 'https://strawhat-wealthily-lyla.ngrok-free.dev/api' // Usando ngrok para garantir acesso do celular físico
  : 'https://api-siga.valtre.com.br/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

// Interceptor para requisições
api.interceptors.request.use((config) => {
  if (__DEV__) {
    console.log(`\n🔵 [${config.method?.toUpperCase()}] ${config.url}`);
    if (config.data) console.log('📦 Payload:', JSON.stringify(config.data, null, 2));
  }

  const token = storage.getString('siga_logger_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para respostas (Tratamento de 401 e Logs)
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`🟢 [${response.config.method?.toUpperCase()}] ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.log(`🔴 [${error.config?.method?.toUpperCase()}] ${error.config?.url} - ${error.response?.status}`);
      console.log('🚨 Erro Data:', JSON.stringify(error.response?.data, null, 2));
    }

    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido -> Logout
      store.dispatch(logout());
      storage.remove('siga_logger_token');
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);
