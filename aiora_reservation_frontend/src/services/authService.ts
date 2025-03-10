import api from './api';
import { LoginRequest, AuthResponse } from '@/types/auth';

const TOKEN_KEY = 'aiora_auth_token';

export const authService = {
  initializeAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
  
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },
  
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Updated endpoint to match the backend controller mapping
    const response = await api.post<AuthResponse>('/v1/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }
};