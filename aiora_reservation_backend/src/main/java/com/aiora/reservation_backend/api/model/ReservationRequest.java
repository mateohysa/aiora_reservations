package com.aiora.reservation_backend.api.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ReservationRequest {
    @NotNull(message = "Reservation date is required")
    private LocalDateTime reservationDate;
    
    @NotNull(message = "Guest name is required")
    private String guestName;
    
    private String roomNumber;
    
    @NotNull(message = "Hotel guest status is required")
    private Boolean isHotelGuest;
    
    private Boolean mealDeducted = false;
    
    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    private Integer guestCount;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    // Getters and setters
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
    
    public Integer getGuestCount() {
        return guestCount;
    }
    
    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}