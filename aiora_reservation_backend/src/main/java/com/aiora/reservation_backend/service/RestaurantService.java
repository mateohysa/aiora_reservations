package com.aiora.reservation_backend.service;

import com.aiora.reservation_backend.dao.RestaurantDao;
import com.aiora.reservation_backend.api.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RestaurantService {
    private final RestaurantDao restaurantDao;

    @Autowired
    public RestaurantService(RestaurantDao restaurantDao) {
        this.restaurantDao = restaurantDao;
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantDao.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, Restaurant restaurantDetails) {
        Restaurant restaurant = restaurantDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        
        restaurant.setName(restaurantDetails.getName());
        restaurant.setRestaurantType(restaurantDetails.getRestaurantType());
        restaurant.setDefaultCapacity(restaurantDetails.getDefaultCapacity());
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
}