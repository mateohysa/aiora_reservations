export interface Restaurant {
  restaurantId: number;
  name: string;
  maxCapacity: number;
  location: string;
  description: string;
  roomOnly: boolean;
  acceptsOutsideGuests: boolean;
}