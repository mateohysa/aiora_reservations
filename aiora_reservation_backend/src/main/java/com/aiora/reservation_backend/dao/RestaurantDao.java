package com.aiora.reservation_backend.dao;

import com.aiora.reservation_backend.model.Restaurant;
import com.aiora.reservation_backend.model.Restaurant.RestaurantType;
import com.aiora.reservation_backend.model.Reservation;
import com.aiora.reservation_backend.model.Reservation.ReservationStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Repository
public class RestaurantDao {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Find a restaurant by its ID
     */
    public Optional<Restaurant> findById(Long id) {
        Restaurant restaurant = entityManager.find(Restaurant.class, id);
        return Optional.ofNullable(restaurant);
    }

    /**
     * Get all restaurants
     */
    public List<Restaurant> findAll() {
        return entityManager.createQuery("SELECT r FROM Restaurant r", Restaurant.class).getResultList();
    }

    /**
     * Find restaurants by type
     */
    public List<Restaurant> findByType(RestaurantType type) {
        TypedQuery<Restaurant> query = entityManager.createQuery(
                "SELECT r FROM Restaurant r WHERE r.restaurantType = :type", Restaurant.class);
        query.setParameter("type", type);
        return query.getResultList();
    }

    /**
     * Find restaurants by name (partial match, case-insensitive)
     */
    public List<Restaurant> findByNameContaining(String name) {
        TypedQuery<Restaurant> query = entityManager.createQuery(
                "SELECT r FROM Restaurant r WHERE LOWER(r.name) LIKE LOWER(:name)", Restaurant.class);
        query.setParameter("name", "%" + name + "%");
        return query.getResultList();
    }

    /**
     * Save a new restaurant or update an existing one
     */
    @Transactional
    public Restaurant save(Restaurant restaurant) {
        if (restaurant.getRestaurantId() == null) {
            entityManager.persist(restaurant);
            return restaurant;
        } else {
            return entityManager.merge(restaurant);
        }
    }

    /**
     * Delete a restaurant by its ID
     */
    @Transactional
    public void deleteById(Long id) {
        Restaurant restaurant = entityManager.find(Restaurant.class, id);
        if (restaurant != null) {
            entityManager.remove(restaurant);
        }
    }

    /**
     * Check if a restaurant exists by its ID
     */
    public boolean existsById(Long id) {
        return entityManager.find(Restaurant.class, id) != null;
    }

    /**
     * Find restaurants with capacity greater than or equal to a specified value
     */
    public List<Restaurant> findByCapacityGreaterThanEqual(Integer capacity) {
        TypedQuery<Restaurant> query = entityManager.createQuery(
                "SELECT r FROM Restaurant r WHERE r.maxCapacity >= :capacity", Restaurant.class);
        query.setParameter("capacity", capacity);
        return query.getResultList();
    }

    /**
     * Find all reservations for a restaurant
     */
    public List<Reservation> findReservationsByRestaurantId(Long restaurantId) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.restaurant.restaurantId = :restaurantId " +
                "ORDER BY r.reservationDate DESC", Reservation.class);
        query.setParameter("restaurantId", restaurantId);
        return query.getResultList();
    }

    /**
     * Find reservations by restaurant and status
     */
    public List<Reservation> findReservationsByRestaurantIdAndStatus(Long restaurantId, ReservationStatus status) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.restaurant.restaurantId = :restaurantId " +
                "AND r.status = :status ORDER BY r.reservationDate DESC", Reservation.class);
        query.setParameter("restaurantId", restaurantId);
        query.setParameter("status", status);
        return query.getResultList();
    }

    /**
     * Find recent reservations for a restaurant with limit
     */
    public List<Reservation> findRecentReservationsByRestaurantId(Long restaurantId, int limit) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.restaurant.restaurantId = :restaurantId " +
                "ORDER BY r.reservationDate DESC", Reservation.class);
        query.setParameter("restaurantId", restaurantId);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Get reservation statistics for a restaurant
     */
    public Map<String, Integer> getReservationStats(Long restaurantId) {
        // Get counts for each status
        TypedQuery<Object[]> query = entityManager.createQuery(
                "SELECT r.status, COUNT(r) FROM Reservation r " +
                "WHERE r.restaurant.restaurantId = :restaurantId GROUP BY r.status", Object[].class);
        query.setParameter("restaurantId", restaurantId);
        
        Map<String, Integer> stats = new HashMap<>();
        stats.put("pending", 0);
        stats.put("confirmed", 0);
        stats.put("total", 0);
        
        List<Object[]> results = query.getResultList();
        for (Object[] result : results) {
            ReservationStatus status = (ReservationStatus) result[0];
            Long count = (Long) result[1];
            stats.put(status.name().toLowerCase(), count.intValue());
            stats.put("total", stats.get("total") + count.intValue());
        }
        
        return stats;
    }
    
    
}