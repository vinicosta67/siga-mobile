import { api } from './api';
import { LoginCredentials, AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // A API documenta /auth/login.
    // Como definimos baseURL como '/api' no api.ts, a rota final será /api/auth/login.
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
};
