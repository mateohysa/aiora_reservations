import api from './api';
import { ReservationRequest, ReservationResponse } from '../types/reservation';

export const reservationService = {
  /**
   * Get all reservations
   */
  getAllReservations: async (): Promise<ReservationResponse[]> => {
    const response = await api.get<ReservationResponse[]>('/v1/reservations');
    return response.data;
  },
  
  /**
   * Get reservation by ID
   */
  getReservationById: async (id: number): Promise<ReservationResponse> => {
    const response = await api.get<ReservationResponse>(`/v1/reservations/${id}`);
    return response.data;
  },
  
  /**
   * Create a new reservation
   */
  createReservation: async (reservation: ReservationRequest): Promise<ReservationResponse> => {
    const response = await api.post<ReservationResponse>('/v1/reservations', reservation);
    return response.data;
  },
  
  /**
   * Update an existing reservation
   */
  updateReservation: async (id: number, reservation: Partial<ReservationRequest>): Promise<ReservationResponse> => {
    const response = await api.put<ReservationResponse>(`/v1/reservations/${id}`, reservation);
    return response.data;
  },
  
  /**
   * Delete a reservation
   */
  deleteReservation: async (id: number): Promise<void> => {
    await api.delete(`/v1/reservations/${id}`);
  }
};