package com.aiora.reservation_backend.service;

import com.aiora.reservation_backend.dao.ReservationDao;
import com.aiora.reservation_backend.dao.RestaurantDao;
import com.aiora.reservation_backend.dao.UserDao;
import com.aiora.reservation_backend.api.exception.*;
import com.aiora.reservation_backend.model.Reservation;
import com.aiora.reservation_backend.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    public void deleteReservation(Long id) {
        Reservation reservation = reservationDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservationDao.delete(reservation);
    }
    // Replace IllegalArgumentException with ValidationException in these methods
    private void validateReservation(Reservation reservation) {
        // Check if user exists
        userDao.findById(reservation.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check if restaurant exists
        Restaurant restaurant = restaurantDao.findById(reservation.getRestaurant().getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        
        // Check if hotel guests are allowed for room-only restaurants
        if (restaurant.getRoomOnly() && !reservation.getIsHotelGuest()) {
            throw new ValidationException("This restaurant only accepts hotel guests");
        }
        
        // Check if outside guests are allowed
        if (!restaurant.getAcceptsOutsideGuests() && !reservation.getIsHotelGuest()) {
            throw new ValidationException("This restaurant does not accept outside guests");
        }
        
        // Validate room number for hotel guests
        if (reservation.getIsHotelGuest() && (reservation.getRoomNumber() == null || reservation.getRoomNumber().trim().isEmpty())) {
            throw new ValidationException("Room number is required for hotel guests");
        }
    }
    // If there's a checkCapacity method that uses defaultCapacity, update it to use maxCapacity instead
    private void checkCapacity(Reservation reservation) {
        Restaurant restaurant = reservation.getRestaurant();
        LocalDateTime reservationDate = reservation.getReservationDate();
        
        // Calculate time window (e.g., 2 hours before and after)
        LocalDateTime startTime = reservationDate.minusHours(2);
        LocalDateTime endTime = reservationDate.plusHours(2);
        
        // Count existing guests in the time window
        int existingGuests = reservationDao.countGuestsByRestaurantAndTime(
                restaurant.getRestaurantId(), startTime, endTime);
        
        // Add new guests
        int totalGuests = existingGuests + reservation.getGuestCount();
        
        // Check against maxCapacity instead of defaultCapacity
        if (totalGuests > restaurant.getMaxCapacity()) {
            throw new ValidationException("Restaurant capacity exceeded for the selected time. " +
                    "Current: " + existingGuests + ", Adding: " + reservation.getGuestCount() + 
                    ", Max: " + restaurant.getMaxCapacity());
        }
    }
    private boolean isCapacityCheckRequired(Reservation existing, Reservation updated) {
        return updated.getReservationDate() != null && 
               updated.getGuestCount() != null && 
               (existing.getReservationDate() == null || 
                !existing.getReservationDate().equals(updated.getReservationDate()) || 
                existing.getGuestCount() == null ||
                !existing.getGuestCount().equals(updated.getGuestCount()));
    }
    public Optional<Reservation> findById(Long id) {
        return reservationDao.findById(id);
    }
    
    private boolean isMealEligibilityCheckRequired(Reservation existing, Reservation updated) {
        return updated.getIsHotelGuest() != null && 
               updated.getMealDeducted() != null && 
               (existing.getIsHotelGuest() == null || 
                existing.getIsHotelGuest() != updated.getIsHotelGuest() ||
                existing.getMealDeducted() == null ||
                existing.getMealDeducted() != updated.getMealDeducted());
    }
    /**
     * Search reservations across multiple fields (guest name, room number, ID, restaurant name)
     * @param query The search query
     * @param limit Maximum number of results to return
     * @return List of matching reservations
     */
    public List<Reservation> searchReservations(String query, int limit) {
        // Convert to lowercase for case-insensitive search with SQL wildcards
        String searchTerm = "%" + query.toLowerCase() + "%";

        // Use the DAO to perform the search
        return reservationDao.searchReservations(searchTerm, query, limit);
    }
    
    private void checkMealEligibility(Reservation reservation) {
        // Only check for hotel guests who want to deduct a meal
        if (reservation.getIsHotelGuest() && reservation.getMealDeducted()) {
            // Check if meal has already been deducted for this room
            if (hasMealBeenDeducted(reservation.getRoomNumber())) {
                throw new ValidationException("Meal has already been deducted for room " + reservation.getRoomNumber());
            }
        }
    }
/**
 * Retrieves all reservations from the database
 * @return List of all reservations
 */
public List<Reservation> getAllReservations() {
    return reservationDao.findAll();
}

public List<Reservation> getRecentReservationsByRestaurant(Long restaurantId, int page, int size) {
    // This would be a new method that uses JPA's Pageable to get paginated results
    // sorted by reservationDate DESC
    return reservationDao.findRecentByRestaurantId(restaurantId, page, size);
}

public long countReservationsByRestaurant(Long restaurantId) {
    // This method would count all reservations for the restaurant
    return reservationDao.countByRestaurantId(restaurantId);
}
}