import api from './api';
import { AuthResponse } from '../types/auth';

export interface UserUpdateRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface UserProfile {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const userService = {
  /**
   * Get all users (admin only)
   */
  getAllUsers: async (): Promise<AuthResponse[]> => {
    const response = await api.get<AuthResponse[]>('/v1/users');
    return response.data;
  },
  
  /**
   * Get user by ID
   */
  getUserById: async (id: number): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>(`/v1/users/${id}`);
    return response.data;
  },
  
  /**
   * Update user information
   */
  updateUser: async (id: number, userData: UserUpdateRequest): Promise<AuthResponse> => {
    const response = await api.put<AuthResponse>(`/v1/users/${id}`, userData);
    return response.data;
  },
  
  /**
   * Delete user
   */
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/v1/users/${id}`);
  }
};