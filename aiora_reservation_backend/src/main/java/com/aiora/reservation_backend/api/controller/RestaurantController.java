package com.aiora.reservation_backend.api.controller;

import com.aiora.reservation_backend.model.Restaurant;
import com.aiora.reservation_backend.model.Reservation;
import com.aiora.reservation_backend.service.RestaurantService;
import com.aiora.reservation_backend.api.model.RestaurantResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        List<RestaurantResponse> responseList = restaurants.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurantById(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurant(id);
        return ResponseEntity.ok(convertToResponse(restaurant));
    }

    @GetMapping("/capacity/{minCapacity}")
    public ResponseEntity<List<RestaurantResponse>> getRestaurantsByCapacity(@PathVariable Integer minCapacity) {
        List<Restaurant> restaurants = restaurantService.findByCapacity(minCapacity);
        List<RestaurantResponse> responseList = restaurants.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @PostMapping
    public ResponseEntity<RestaurantResponse> createRestaurant(@Valid @RequestBody Restaurant restaurant) {
        Restaurant created = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(convertToResponse(created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantResponse> updateRestaurant(@PathVariable Long id, @Valid @RequestBody Restaurant restaurant) {
        Restaurant updated = restaurantService.updateRestaurant(id, restaurant);
        return ResponseEntity.ok(convertToResponse(updated));
    }

    @GetMapping("/{restaurantId}/reservations/status")
    public ResponseEntity<List<Reservation>> getRestaurantReservations(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(restaurantService.getReservationsByStatus(restaurantId, status));
        }
        return ResponseEntity.ok(restaurantService.getReservations(restaurantId));
    }

    @GetMapping("/{restaurantId}/reservations/recent")
    public ResponseEntity<List<Reservation>> getRecentReservations(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "3") int limit) {
        return ResponseEntity.ok(restaurantService.getRecentReservations(restaurantId, limit));
    }

    @GetMapping("/{restaurantId}/reservations/stats")
    public ResponseEntity<Map<String, Integer>> getReservationStats(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(restaurantService.getReservationStats(restaurantId));
    }
    
    // Convert Restaurant entity to RestaurantResponse DTO
    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        RestaurantResponse response = new RestaurantResponse();
        response.setRestaurantId(restaurant.getRestaurantId());
        response.setName(restaurant.getName());
        response.setRestaurantType(restaurant.getRestaurantType());
        response.setDefaultCapacity(restaurant.getDefaultCapacity());
        response.setMaxCapacity(restaurant.getMaxCapacity());
        response.setLocation(restaurant.getLocation());
        response.setDescription(restaurant.getDescription());
        response.setAcceptsOutsideGuests(restaurant.getAcceptsOutsideGuests());
        response.setRoomOnly(restaurant.getRoomOnly());
        return response;
    }
}