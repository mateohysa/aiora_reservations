'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '@/services';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { ReservationStatus } from '@/types/reservation';

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const reservationId = Number(params.id);
  
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: reservation, isLoading, error } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => reservationService.getReservationById(reservationId),
    enabled: !isNaN(reservationId)
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: ReservationStatus }) => 
      reservationService.updateReservation(id, { reservationStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    }
  });
  
  const deleteReservationMutation = useMutation({
    mutationFn: (id: number) => reservationService.deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      router.push('/dashboard/reservations');
    }
  });
  
  if (isLoading) {
    return <div>Loading reservation details...</div>;
  }
  
  if (error || !reservation) {
    return <div>Error loading reservation details</div>;
  }
  
  const handleStatusChange = (status: ReservationStatus) => {
    updateStatusMutation.mutate({ id: reservationId, status });
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      deleteReservationMutation.mutate(reservationId);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservation Details</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {reservation.guestName}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Reservation #{reservation.reservationId}
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <select
                    value={reservation.reservationStatus}
                    onChange={(e) => handleStatusChange(e.target.value as ReservationStatus)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${reservation.reservationStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                      reservation.reservationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      reservation.reservationStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'}`}>
                    {reservation.reservationStatus}
                  </span>
                )}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(reservation.reservationDate).toLocaleString()}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Number of Guests</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {reservation.guestCount}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Hotel Guest</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {reservation.isHotelGuest ? 'Yes' : 'No'}
              </dd>
            </div>
            
            {reservation.isHotelGuest && (
              <>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Room Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {reservation.roomNumber}
                  </dd>
                </div>
                
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Meal Deducted</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {reservation.mealDeducted ? 'Yes' : 'No'}
                  </dd>
                </div>
              </>
            )}
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {reservation.username}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => router.push('/dashboard/reservations')}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Reservations
        </button>
      </div>
    </div>
  );
}