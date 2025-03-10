export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export interface Reservation {
  reservationId: number;
  reservationDate: string; // ISO date string
  guestName: string;
  roomNumber?: string;
  isHotelGuest: boolean;
  mealDeducted: boolean;
  guestCount: number;
  reservationStatus: ReservationStatus;
  restaurant: {
    restaurantId: number;
    name: string;
  };
  user: {
    userId: number;
    username: string;
  };
  notes?: string;
}

export interface ReservationRequest {
  reservationDate: string; // ISO date string
  guestName: string;
  roomNumber?: string;
  isHotelGuest: boolean;
  mealDeducted: boolean;
  guestCount: number;
  userId: number;
  notes?: string;
  reservationStatus?: ReservationStatus;
}

export interface ReservationResponse {
  reservationId: number;
  reservationDate: string; // ISO date string
  guestName: string;
  roomNumber?: string;
  isHotelGuest: boolean;
  mealDeducted: boolean;
  reservationStatus: ReservationStatus;
  guestCount: number;
  restaurantId?: number;
  restaurantName?: string;
  userId: number;
  username: string;
  notes?: string;
}