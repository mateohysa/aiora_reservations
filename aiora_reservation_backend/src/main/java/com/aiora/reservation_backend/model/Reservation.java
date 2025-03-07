package com.aiora.reservation_backend.model;

 import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate;
    
    @Column(name = "guest_name", nullable = false)
    private String guestName;
    
    @Column(name = "room_number")
    private String roomNumber;
    
    @Column(name = "is_hotel_guest")
    private Boolean isHotelGuest;
    
    @Column(name = "meal_deducted")
    private Boolean mealDeducted;
    
    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status", nullable = false)
    private ReservationStatus reservationStatus;
    
    // Enum for reservation status
    public enum ReservationStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
    
    // Getters and Setters
    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
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
    
    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public ReservationStatus getReservationStatus() {
        return reservationStatus;
    }

    public void setReservationStatus(ReservationStatus reservationStatus) {
        this.reservationStatus = reservationStatus;
    }
}