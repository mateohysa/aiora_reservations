package com.aiora.reservation_backend.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id")
    private Long restaurantId;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "restaurant_type", nullable = false)
    private RestaurantType restaurantType;
    
    @Column(name = "default_capacity", nullable = false)
    private Integer defaultCapacity;
    
    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;
    
    @Column(nullable = false)
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "accepts_outside_guests")
    private Boolean acceptsOutsideGuests;
    
    @Column(name = "room_only")
    private Boolean roomOnly;
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private Set<Reservation> reservations;
    
    // Enum for restaurant type
    public enum RestaurantType {
        FINE_DINING, CASUAL, BUFFET, SPECIALTY
    }
    
    // Getters and setters
    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public RestaurantType getRestaurantType() {
        return restaurantType;
    }

    public void setRestaurantType(RestaurantType restaurantType) {
        this.restaurantType = restaurantType;
    }

    public Integer getDefaultCapacity() {
        return defaultCapacity;
    }

    public void setDefaultCapacity(Integer defaultCapacity) {
        this.defaultCapacity = defaultCapacity;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getAcceptsOutsideGuests() {
        return acceptsOutsideGuests;
    }

    public void setAcceptsOutsideGuests(Boolean acceptsOutsideGuests) {
        this.acceptsOutsideGuests = acceptsOutsideGuests;
    }

    public Boolean getRoomOnly() {
        return roomOnly;
    }

    public void setRoomOnly(Boolean roomOnly) {
        this.roomOnly = roomOnly;
    }

    public Set<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(Set<Reservation> reservations) {
        this.reservations = reservations;
    }
}