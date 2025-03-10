'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '@/services';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

export default function NewReservationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    guestName: '',
    reservationDate: '',
    reservationTime: '18:00',
    guestCount: 2,
    isHotelGuest: false,
    roomNumber: '',
    mealDeducted: false,
    notes: ''
  });

  const createReservationMutation = useMutation({
    mutationFn: (data: any) => {
      // Combine date and time
      const dateTime = new Date(`${data.reservationDate}T${data.reservationTime}`);
      
      return reservationService.createReservation({
        reservationDate: dateTime.toISOString(),
        guestName: data.guestName,
        roomNumber: data.isHotelGuest ? data.roomNumber : undefined,
        isHotelGuest: data.isHotelGuest,
        mealDeducted: data.mealDeducted,
        guestCount: data.guestCount,
        userId: user?.userId || 1, // Default to 1 for MVP
        notes: data.notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      router.push('/dashboard/reservations');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservationMutation.mutate(formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Reservation</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">
                Guest Name
              </label>
              <input
                type="text"
                name="guestName"
                id="guestName"
                required
                value={formData.guestName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                Number of Guests
              </label>
              <input
                type="number"
                name="guestCount"
                id="guestCount"
                min="1"
                required
                value={formData.guestCount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700">
                Reservation Date
              </label>
              <input
                type="date"
                name="reservationDate"
                id="reservationDate"
                required
                value={formData.reservationDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="reservationTime" className="block text-sm font-medium text-gray-700">
                Reservation Time
              </label>
              <select
                name="reservationTime"
                id="reservationTime"
                required
                value={formData.reservationTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isHotelGuest"
                    name="isHotelGuest"
                    type="checkbox"
                    checked={formData.isHotelGuest}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isHotelGuest" className="font-medium text-gray-700">
                    Hotel Guest
                  </label>
                </div>
              </div>
            </div>
            
            {formData.isHotelGuest && (
              <>
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="mealDeducted"
                      name="mealDeducted"
                      type="checkbox"
                      checked={formData.mealDeducted}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="mealDeducted" className="font-medium text-gray-700">
                      Meal Deducted from Room
                    </label>
                  </div>
                </div>
              </>
            )}
            
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createReservationMutation.isPending}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {createReservationMutation.isPending ? 'Saving...' : 'Create Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}