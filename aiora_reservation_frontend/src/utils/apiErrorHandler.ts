import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Handle expired token
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('token');
    }
    
    return {
      message: axiosError.response?.data?.message || 'An error occurred',
      status: axiosError.response?.status,
      details: axiosError.response?.data?.details || axiosError.message
    };
  }
  
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred'
  };
};