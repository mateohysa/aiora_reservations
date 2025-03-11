const API_URL = '/api/v1'; // Changed from '/api' to '/api/v1' to match backend routes

// Authentication services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        const errorData = await response.json().catch(() => {
          // Handle empty or invalid JSON response
          return { message: 'Invalid server response' };
        });
        
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to the server. Please make sure the backend is running.');
      }
      throw error;
    }
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return response.json();
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Create a fetch wrapper with authentication
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };
  
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${url}`, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      return { message: 'Invalid server response' };
    });
    throw new Error(errorData.message || 'API request failed');
  }
  
  return response.json();
};