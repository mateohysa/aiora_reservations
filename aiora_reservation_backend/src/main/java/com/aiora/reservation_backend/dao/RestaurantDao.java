package com.aiora.reservation_backend.dao;

import com.aiora.reservation_backend.model.Restaurant;
import com.aiora.reservation_backend.model.Restaurant.RestaurantType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
}