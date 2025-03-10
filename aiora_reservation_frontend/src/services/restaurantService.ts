import api from './api';

export interface Restaurant {
  restaurantId: number;
  name: string;
  description?: string;
  location?: string;
}

// Fix the API endpoints to match your backend structure
export const restaurantService = {
  /**
   * Get all restaurants
   */
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>('/v1/restaurants');
    return response.data;
  },
  
  /**
   * Get restaurant by ID
   */
  getRestaurantById: async (id: number): Promise<Restaurant> => {
    const response = await api.get<Restaurant>(`/v1/restaurants/${id}`);
    return response.data;
  },
  
  // Fix the endpoints to match the pattern used above
  createRestaurant: async (data: Omit<Restaurant, 'restaurantId'>): Promise<Restaurant> => {
    const response = await api.post<Restaurant>('/v1/restaurants', data);
    return response.data;
  },
  
  updateRestaurant: async (id: number, data: Partial<Restaurant>): Promise<Restaurant> => {
    const response = await api.put<Restaurant>(`/v1/restaurants/${id}`, data);
    return response.data;
  },
  
  deleteRestaurant: async (id: number): Promise<void> => {
    await api.delete(`/v1/restaurants/${id}`);
  }
};