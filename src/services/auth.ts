import { AuthResponse, LoginCredentials, RegisterPayload, RegisterResponse, VerifyEmailPayload } from '../types/auth';
import { api } from './api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', payload);
    return response.data;
  },
  verifyEmail: async (payload: VerifyEmailPayload): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/verify-email', payload);
    return response.data;
  },
  forgotPassword: async (payload: { email: string }) => {
    const response = await api.post('/auth/forgot-password', payload, {
      headers: {
        Origin: 'sigamobile://'
      }
    });
    return response.data;
  },
  resetPassword: async (payload: { token: string, password: string }) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  }
};
