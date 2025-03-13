package com.aiora.reservation_backend.api.model;

import com.aiora.reservation_backend.model.Restaurant.RestaurantType;

public class RestaurantResponse {
    private Long restaurantId;
    private String name;
    private RestaurantType restaurantType;
    private Integer defaultCapacity;
    private Integer maxCapacity;
    private String location;
    private String description;
    private Boolean acceptsOutsideGuests;
    private Boolean roomOnly;
    
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
} 
