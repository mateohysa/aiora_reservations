package com.aiora.reservation_backend.api.controller;

import com.aiora.reservation_backend.api.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.api.model.ReservationRequest;
import com.aiora.reservation_backend.api.model.ReservationResponse;
import com.aiora.reservation_backend.model.Reservation;
import com.aiora.reservation_backend.model.Restaurant;
import com.aiora.reservation_backend.model.User;
import com.aiora.reservation_backend.service.ReservationService;
import com.aiora.reservation_backend.service.RestaurantService;
import com.aiora.reservation_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reservations/{restaurantId}/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final RestaurantService restaurantService;
    private final UserService userService;

    @Autowired
    public ReservationController(ReservationService reservationService, 
                                RestaurantService restaurantService,
                                UserService userService) {
        this.reservationService = reservationService;
        this.restaurantService = restaurantService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getRestaurantReservations(@PathVariable Long restaurantId) {
        List<Reservation> reservations = reservationService.getReservationsByRestaurant(restaurantId);
        List<ReservationResponse> responses = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    // Add this method to your ReservationController class
    
    @GetMapping("/date-range")
    public ResponseEntity<List<ReservationResponse>> getReservationsByDateRange(
            @PathVariable Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<Reservation> reservations = reservationService.getReservationsByDateRange(startDate, endDate);
        List<ReservationResponse> responses = reservations.stream()
                .filter(r -> r.getRestaurant().getRestaurantId().equals(restaurantId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long restaurantId, @PathVariable Long id) {
        Reservation reservation = reservationService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return ResponseEntity.ok(convertToResponse(reservation));
    }
    
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @PathVariable Long restaurantId,
            @Valid @RequestBody ReservationRequest request) {
        
        Restaurant restaurant = restaurantService.getRestaurant(restaurantId);
        User user = userService.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        Reservation reservation = convertToEntity(request);
        reservation.setRestaurant(restaurant);
        reservation.setUser(user);
        
        Reservation savedReservation = reservationService.createReservation(reservation);
        return new ResponseEntity<>(convertToResponse(savedReservation), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponse> updateReservation(
            @PathVariable Long restaurantId,
            @PathVariable Long id,
            @Valid @RequestBody ReservationRequest request) {
        
        Restaurant restaurant = restaurantService.getRestaurant(restaurantId);
        User user = userService.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        Reservation reservation = convertToEntity(request);
        reservation.setRestaurant(restaurant);
        reservation.setUser(user);
        
        Reservation updatedReservation = reservationService.updateReservation(id, reservation);
        return ResponseEntity.ok(convertToResponse(updatedReservation));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long restaurantId, @PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<ReservationResponse>> getRecentReservations(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "3") int limit) {
        
        List<Reservation> reservations = restaurantService.getRecentReservations(restaurantId, limit);
        
        // Convert to DTOs
        List<ReservationResponse> responseList = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(responseList);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getReservationStats(@PathVariable Long restaurantId) {
        // Implementation of getReservationStats method
        return null; // Placeholder return, actual implementation needed
    }
    
    private Reservation convertToEntity(ReservationRequest request) {
        Reservation reservation = new Reservation();
        reservation.setReservationDate(request.getReservationDate());
        reservation.setGuestName(request.getGuestName());
        reservation.setRoomNumber(request.getRoomNumber());
        reservation.setIsHotelGuest(request.getIsHotelGuest());
        reservation.setMealDeducted(request.getMealDeducted());
        reservation.setGuestCount(request.getGuestCount());
        reservation.setReservationStatus(Reservation.ReservationStatus.CONFIRMED);
        return reservation;
    }
    
    private ReservationResponse convertToResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setReservationId(reservation.getReservationId());
        response.setReservationDate(reservation.getReservationDate());
        response.setGuestName(reservation.getGuestName());
        response.setRoomNumber(reservation.getRoomNumber());
        response.setIsHotelGuest(reservation.getIsHotelGuest());
        response.setMealDeducted(reservation.getMealDeducted());
        response.setReservationStatus(reservation.getReservationStatus());
        response.setGuestCount(reservation.getGuestCount());
        response.setRestaurantId(reservation.getRestaurant().getRestaurantId());
        response.setRestaurantName(reservation.getRestaurant().getName());
        response.setUserId(reservation.getUser().getUserId());
        response.setUsername(reservation.getUser().getUsername());
        return response;
    }
}