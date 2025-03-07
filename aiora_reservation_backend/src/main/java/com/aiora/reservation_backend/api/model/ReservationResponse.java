package com.aiora.reservation_backend.api.model;

import com.aiora.reservation_backend.model.Reservation.ReservationStatus;
import java.time.LocalDateTime;

public class ReservationResponse {
    private Long reservationId;
    private LocalDateTime reservationDate;
    private String guestName;
    private String roomNumber;
    private Boolean isHotelGuest;
    private Boolean mealDeducted;
    private ReservationStatus reservationStatus;
    private Integer guestCount;
    private Long restaurantId;
    private String restaurantName;
    private Long userId;
    private String username;
    
    // Getters and setters
    public Long getReservationId() {
        return reservationId;
    }
    
    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }
    
    public LocalDateTime getReservationDate() {
        return reservationDate;
    }
    
    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }
    
    public String getGuestName() {
        return guestName;
    }
    
    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }
    
    public String getRoomNumber() {
        return roomNumber;
    }
    
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
    
    public Boolean getIsHotelGuest() {
        return isHotelGuest;
    }
    
    public void setIsHotelGuest(Boolean isHotelGuest) {
        this.isHotelGuest = isHotelGuest;
    }
    
    public Boolean getMealDeducted() {
        return mealDeducted;
    }
    
    public void setMealDeducted(Boolean mealDeducted) {
        this.mealDeducted = mealDeducted;
    }
    
    public ReservationStatus getReservationStatus() {
        return reservationStatus;
    }
    
    public void setReservationStatus(ReservationStatus reservationStatus) {
        this.reservationStatus = reservationStatus;
    }
    
    public Integer getGuestCount() {
        return guestCount;
    }
    
    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }
    
    public Long getRestaurantId() {
        return restaurantId;
    }
    
    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
    
    public String getRestaurantName() {
        return restaurantName;
    }
    
    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}