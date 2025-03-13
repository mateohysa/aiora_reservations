package com.aiora.reservation_backend.service;

import com.aiora.reservation_backend.dao.RestaurantDao;
import com.aiora.reservation_backend.dao.ReservationDao;
import com.aiora.reservation_backend.api.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.model.Restaurant;
import com.aiora.reservation_backend.model.Reservation;
import com.aiora.reservation_backend.model.Reservation.ReservationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;

@Service
@Transactional
public class RestaurantService {
    private final RestaurantDao restaurantDao;
    private final ReservationDao reservationDao;

    @Autowired
    public RestaurantService(RestaurantDao restaurantDao, ReservationDao reservationDao) {
        this.restaurantDao = restaurantDao;
        this.reservationDao = reservationDao;
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantDao.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, Restaurant restaurantDetails) {
        Restaurant restaurant = restaurantDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        
        restaurant.setName(restaurantDetails.getName());
        // Removed: restaurant.setRestaurantType(restaurantDetails.getRestaurantType());
        // Removed: restaurant.setDefaultCapacity(restaurantDetails.getDefaultCapacity());
        restaurant.setMaxCapacity(restaurantDetails.getMaxCapacity());
        restaurant.setLocation(restaurantDetails.getLocation());
        restaurant.setDescription(restaurantDetails.getDescription());
        
        return restaurantDao.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantDao.findAll();
    }

    public Restaurant getRestaurant(Long id) {
        return restaurantDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }

    public List<Restaurant> findByCapacity(Integer capacity) {
        return restaurantDao.findByCapacityGreaterThanEqual(capacity);
    }

    public List<Reservation> getReservations(Long restaurantId) {
        // Verify restaurant exists
        Restaurant restaurant = restaurantDao.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        return restaurantDao.findReservationsByRestaurantId(restaurantId);
    }

    public List<Reservation> getReservationsByStatus(Long restaurantId, String status) {
        // Verify restaurant exists
        Restaurant restaurant = restaurantDao.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        // Convert string status to enum
        ReservationStatus reservationStatus;
        try {
            reservationStatus = ReservationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid reservation status: " + status);
        }
        
        return restaurantDao.findReservationsByRestaurantIdAndStatus(
            restaurantId, 
            reservationStatus
        );
    }

    public List<Reservation> getRecentReservations(Long restaurantId, int limit) {
        // Verify restaurant exists
        Restaurant restaurant = restaurantDao.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        return restaurantDao.findRecentReservationsByRestaurantId(restaurantId, limit);
    }

   
}
