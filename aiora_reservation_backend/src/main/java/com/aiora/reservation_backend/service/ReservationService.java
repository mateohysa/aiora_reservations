package com.aiora.reservation_backend.service;

import com.aiora.reservation_backend.dao.ReservationDao;
import com.aiora.reservation_backend.dao.RestaurantDao;
import com.aiora.reservation_backend.dao.UserDao;
import com.aiora.reservation_backend.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.model.Reservation;
import com.aiora.reservation_backend.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReservationService {
    private final ReservationDao reservationDao;
    private final RestaurantDao restaurantDao;
    private final UserDao userDao;

    @Autowired
    public ReservationService(ReservationDao reservationDao, RestaurantDao restaurantDao, UserDao userDao) {
        this.reservationDao = reservationDao;
        this.restaurantDao = restaurantDao;
        this.userDao = userDao;
    }

    public Reservation createReservation(Reservation reservation) {
        validateReservation(reservation);
        checkCapacity(reservation);
        checkMealEligibility(reservation);
        return reservationDao.save(reservation);
    }

    public Reservation updateReservation(Long id, Reservation reservationDetails) {
        Reservation reservation = reservationDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        validateReservation(reservationDetails);
        
        // Only check capacity if date or guest count changes
        if (!reservation.getReservationDate().equals(reservationDetails.getReservationDate()) || 
            !reservation.getGuestCount().equals(reservationDetails.getGuestCount())) {
            checkCapacity(reservationDetails);
        }
        
        // Only check meal eligibility if hotel guest status changes
        if (reservation.getIsHotelGuest() != reservationDetails.getIsHotelGuest() ||
            reservation.getMealDeducted() != reservationDetails.getMealDeducted()) {
            checkMealEligibility(reservationDetails);
        }
        
        // Update reservation fields
        reservation.setReservationDate(reservationDetails.getReservationDate());
        reservation.setGuestName(reservationDetails.getGuestName());
        reservation.setRoomNumber(reservationDetails.getRoomNumber());
        reservation.setIsHotelGuest(reservationDetails.getIsHotelGuest());
        reservation.setMealDeducted(reservationDetails.getMealDeducted());
        reservation.setReservationStatus(reservationDetails.getReservationStatus());
        reservation.setGuestCount(reservationDetails.getGuestCount());
        
        return reservationDao.save(reservation);
    }

    public List<Reservation> getReservationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return reservationDao.findByDateRange(startDate, endDate);
    }

    public List<Reservation> getReservationsByRestaurant(Long restaurantId) {
        return reservationDao.findByRestaurantId(restaurantId);
    }
    
    public List<Reservation> getReservationsByRoomNumber(String roomNumber) {
        return reservationDao.findByRoomNumber(roomNumber);
    }
    
    public boolean hasMealBeenDeducted(String roomNumber) {
        List<Reservation> reservations = reservationDao.findByRoomNumberAndMealDeducted(roomNumber, true);
        return !reservations.isEmpty();
    }

    private void validateReservation(Reservation reservation) {
        // Check if user exists
        userDao.findById(reservation.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check if restaurant exists
        Restaurant restaurant = restaurantDao.findById(reservation.getRestaurant().getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        
        // Check if hotel guests are allowed for room-only restaurants
        if (restaurant.getRoomOnly() && !reservation.getIsHotelGuest()) {
            throw new IllegalArgumentException("This restaurant only accepts hotel guests");
        }
        
        // Check if outside guests are allowed
        if (!restaurant.getAcceptsOutsideGuests() && !reservation.getIsHotelGuest()) {
            throw new IllegalArgumentException("This restaurant does not accept outside guests");
        }
        
        // Validate room number for hotel guests
        if (reservation.getIsHotelGuest() && (reservation.getRoomNumber() == null || reservation.getRoomNumber().trim().isEmpty())) {
            throw new IllegalArgumentException("Room number is required for hotel guests");
        }
    }
    
    private void checkCapacity(Reservation reservation) {
        Restaurant restaurant = reservation.getRestaurant();
        LocalDateTime reservationDate = reservation.getReservationDate();
        
        // Get total guest count for the restaurant at the specified time
        int currentGuestCount = reservationDao.countGuestsByRestaurantAndTime(
                restaurant.getRestaurantId(), 
                reservationDate.minusHours(2), 
                reservationDate.plusHours(2));
        
        // Add the new reservation's guest count
        int totalGuestCount = currentGuestCount + reservation.getGuestCount();
        
        // Check against max capacity
        if (totalGuestCount > restaurant.getMaxCapacity()) {
            throw new IllegalArgumentException("Restaurant capacity exceeded for the requested time");
        }
    }
    
    private void checkMealEligibility(Reservation reservation) {
        // Only check for hotel guests who want to deduct a meal
        if (reservation.getIsHotelGuest() && reservation.getMealDeducted()) {
            // Check if meal has already been deducted for this room
            if (hasMealBeenDeducted(reservation.getRoomNumber())) {
                throw new IllegalArgumentException("Meal has already been deducted for room " + reservation.getRoomNumber());
            }
        }
    }
}