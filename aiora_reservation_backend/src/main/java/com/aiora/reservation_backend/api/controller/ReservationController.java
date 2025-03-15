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
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/restaurants/{restaurantId}/reservations")
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
    public ResponseEntity<Map<String, Object>> getRecentReservations(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Implement proper pagination with sorting by date (most recent first)
        // This assumes you have a method in your service to handle this
        List<Reservation> reservations = reservationService.getRecentReservationsByRestaurant(
            restaurantId, page, size);
        
        // Get total count for pagination metadata
        long totalReservations = reservationService.countReservationsByRestaurant(restaurantId);
        
        // Convert to DTOs
        List<ReservationResponse> responseList = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        // Create response with pagination metadata
        Map<String, Object> response = new HashMap<>();
        response.put("reservations", responseList);
        response.put("currentPage", page);
        response.put("totalItems", totalReservations);
        response.put("totalPages", (int) Math.ceil((double) totalReservations / size));
                
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getReservationStats(@PathVariable Long restaurantId) {
        Map<String, Integer> stats = new HashMap<>();
    
    // Get all reservations for the restaurant
        List<Reservation> reservations = reservationService.getReservationsByRestaurant(restaurantId);
    
    // Count total
        stats.put("totalReservations", reservations.size());
    
    // Count by status
        int pendingCount = (int) reservations.stream()
            .filter(r -> r.getReservationStatus() == Reservation.ReservationStatus.PENDING)
            .count();
        stats.put("pendingReservations", pendingCount);
    
        int confirmedCount = (int) reservations.stream()
            .filter(r -> r.getReservationStatus() == Reservation.ReservationStatus.CONFIRMED)
            .count();
        stats.put("confirmedReservations", confirmedCount);
    
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/debug")
    public ResponseEntity<Map<String, String>> debugEndpoint(@PathVariable Long restaurantId) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Debug endpoint reached successfully");
        response.put("restaurantId", restaurantId.toString());
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
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