package com.aiora.reservation_backend.api.controller;

import com.aiora.reservation_backend.api.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.api.model.ReservationResponse;
import com.aiora.reservation_backend.model.Reservation;
import com.aiora.reservation_backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reservations")
public class GlobalReservationController {

    private final ReservationService reservationService;

    @Autowired
    public GlobalReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        List<ReservationResponse> responses = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long id) {
        Reservation reservation = reservationService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return ResponseEntity.ok(convertToResponse(reservation));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ReservationResponse>> getReservationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<Reservation> reservations = reservationService.getReservationsByDateRange(startDate, endDate);
        List<ReservationResponse> responses = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/room/{roomNumber}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByRoomNumber(@PathVariable String roomNumber) {
        List<Reservation> reservations = reservationService.getReservationsByRoomNumber(roomNumber);
        List<ReservationResponse> responses = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
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