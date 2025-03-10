export interface User {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}