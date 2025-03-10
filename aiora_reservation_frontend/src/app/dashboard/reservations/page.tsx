'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reservationService } from '@/services';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ReservationsPage() {
  const [restaurantId, setRestaurantId] = useState(1); // Default restaurant ID
  
  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations', restaurantId],
    queryFn: () => reservationService.getAllReservations(),
  });

  if (isLoading) {
    return <div>Loading reservations...</div>;
  }

  if (error) {
    return <div>Error loading reservations</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <Link 
          href="/dashboard/reservations/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          New Reservation
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {reservations && reservations.length > 0 ? (
            reservations.map((reservation) => (
              <li key={reservation.reservationId}>
                <Link href={`/dashboard/reservations/${reservation.reservationId}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {reservation.guestName}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${reservation.reservationStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                            reservation.reservationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {reservation.reservationStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {format(new Date(reservation.reservationDate), 'PPP p')}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Guests: {reservation.guestCount}
                        </p>
                      </div>
                      {reservation.isHotelGuest && (
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Room: {reservation.roomNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No reservations found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}