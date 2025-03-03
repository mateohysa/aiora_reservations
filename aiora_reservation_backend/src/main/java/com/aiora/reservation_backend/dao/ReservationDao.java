package com.aiora.reservation_backend.dao;

import com.aiora.reservation_backend.model.Reservation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class ReservationDao {

    @PersistenceContext
    private EntityManager entityManager;

    public Optional<Reservation> findById(Long id) {
        Reservation reservation = entityManager.find(Reservation.class, id);
        return Optional.ofNullable(reservation);
    }

    public List<Reservation> findAll() {
        return entityManager.createQuery("SELECT r FROM Reservation r", Reservation.class).getResultList();
    }

    public List<Reservation> findByRestaurantId(Long restaurantId) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.restaurant.restaurantId = :restaurantId", Reservation.class);
        query.setParameter("restaurantId", restaurantId);
        return query.getResultList();
    }

    public List<Reservation> findByUserId(Long userId) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.user.userId = :userId", Reservation.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    public List<Reservation> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.reservationDate BETWEEN :startDate
                "SELECT r FROM Reservation r WHERE r.reservationDate BETWEEN :startDate AND :endDate", 
                Reservation.class);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        return query.getResultList();
    }

    /**
     * Find reservations for a specific restaurant and date range
     */
    public List<Reservation> findByRestaurantAndDateRange(Long restaurantId, LocalDateTime startDate, LocalDateTime endDate) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.restaurant.restaurantId = :restaurantId " +
                "AND r.reservationDate BETWEEN :startDate AND :endDate", 
                Reservation.class);
        query.setParameter("restaurantId", restaurantId);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        return query.getResultList();
    }

    /**
     * Count confirmed reservations for a restaurant on a specific date range
     */
    public Integer countConfirmedReservationsByRestaurantAndDateRange(Long restaurantId, LocalDateTime startDate, LocalDateTime endDate) {
        TypedQuery<Long> query = entityManager.createQuery(
                "SELECT COUNT(r) FROM Reservation r WHERE r.restaurant.restaurantId = :restaurantId " +
                "AND r.reservationDate BETWEEN :startDate AND :endDate " +
                "AND r.reservationStatus = :status", 
                Long.class);
        query.setParameter("restaurantId", restaurantId);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        query.setParameter("status", ReservationStatus.CONFIRMED);
        return query.getSingleResult().intValue();
    }

    /**
     * Save a new reservation or update an existing one
     */
    @Transactional
    public Reservation save(Reservation reservation) {
        if (reservation.getReservationId() == null) {
            entityManager.persist(reservation);
            return reservation;
        } else {
            return entityManager.merge(reservation);
        }
    }

    /**
     * Delete a reservation by its ID
     */
    @Transactional
    public void deleteById(Long id) {
        Reservation reservation = entityManager.find(Reservation.class, id);
        if (reservation != null) {
            entityManager.remove(reservation);
        }
    }

    /**
     * Check if a reservation exists by its ID
     */
    public boolean existsById(Long id) {
        return entityManager.find(Reservation.class, id) != null;
    }

    /**
     * Find reservations by room number
     */
    public List<Reservation> findByRoomNumber(String roomNumber) {
        TypedQuery<Reservation> query = entityManager.createQuery(
                "SELECT r FROM Reservation r WHERE r.roomNumber = :roomNumber", Reservation.class);
        query.setParameter("roomNumber", roomNumber);
        return query.getResultList();
    }
}