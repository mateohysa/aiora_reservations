// Base API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Authentication service
export const authService = {
  // Login function
  login: async (credentials) => {
    try {
      // For development, simulate a successful login
      if (process.env.NODE_ENV === 'development') {
        return {
          userId: 1,
          username: credentials.username,
          firstName: 'Admin',
          lastName: 'User',
          token: 'mock-jwt-token'
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login. Please try again.');
    }
  },
  
  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Function to make authenticated API requests
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // For development, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock data for endpoint:', endpoint);
    return mockData[endpoint] || [];
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse(response);
};

// Mock data for development
const mockData = {
  '/restaurants': [
    {
      restaurantId: 1,
      name: "The Grand Dining",
      restaurantType: "FINE_DINING",
      defaultCapacity: 50,
      maxCapacity: 75,
      location: "Main Building, 1st Floor",
      description: "Elegant fine dining experience",
      roomOnly: true
    },
    {
      restaurantId: 2,
      name: "Casual Corner",
      restaurantType: "CASUAL",
      defaultCapacity: 30,
      maxCapacity: 40,
      location: "East Wing, Ground Floor",
      description: "Relaxed casual dining",
      roomOnly: false
    },
    {
      restaurantId: 3,
      name: "Sunset Lounge",
      restaurantType: "LOUNGE",
      defaultCapacity: 25,
      maxCapacity: 35,
      location: "West Wing, Top Floor",
      description: "Scenic rooftop dining",
      roomOnly: false
    }
  ],
  '/restaurants/1/reservations': [],
  '/restaurants/2/reservations': [
    { id: 1, guestName: "John Doe", date: "2024-03-15", time: "20:00", status: "CONFIRMED" },
    { id: 2, guestName: "Jane Smith", date: "2024-03-15", time: "19:30", status: "PENDING" },
    { id: 3, guestName: "Robert Brown", date: "2024-03-16", time: "18:00", status: "CONFIRMED" },
    { id: 4, guestName: "Emily Davis", date: "2024-03-16", time: "20:30", status: "CONFIRMED" },
    { id: 5, guestName: "Michael Wilson", date: "2024-03-17", time: "19:00", status: "PENDING" },
    { id: 6, guestName: "Sarah Johnson", date: "2024-03-17", time: "21:00", status: "CONFIRMED" }
  ],
  '/restaurants/3/reservations': [
    { id: 7, guestName: "David Lee", date: "2024-03-15", time: "18:30", status: "CONFIRMED" },
    { id: 8, guestName: "Lisa Wang", date: "2024-03-15", time: "20:00", status: "CONFIRMED" },
    { id: 9, guestName: "James Taylor", date: "2024-03-16", time: "19:00", status: "PENDING" },
    { id: 10, guestName: "Anna Garcia", date: "2024-03-16", time: "21:30", status: "CONFIRMED" },
    { id: 11, guestName: "Kevin Martinez", date: "2024-03-17", time: "18:00", status: "PENDING" },
    { id: 12, guestName: "Sophia Rodriguez", date: "2024-03-17", time: "20:30", status: "CONFIRMED" },
    { id: 13, guestName: "Thomas Wilson", date: "2024-03-18", time: "19:30", status: "PENDING" },
    { id: 14, guestName: "Olivia Brown", date: "2024-03-18", time: "21:00", status: "CONFIRMED" }
  ]
};