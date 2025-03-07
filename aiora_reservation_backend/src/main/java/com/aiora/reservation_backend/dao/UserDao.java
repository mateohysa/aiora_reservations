package com.aiora.reservation_backend.dao;

import com.aiora.reservation_backend.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.hibernate.NonUniqueResultException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Find a user by their ID
     */
    public Optional<User> findById(Long id) {
        User user = entityManager.find(User.class, id);
        return Optional.ofNullable(user);
    }

    /**
     * Find a user by their username
     */
    public Optional<User> findByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT u FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", username);
        
        try {
            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        } catch (NonUniqueResultException e) {            throw new IllegalStateException("Multiple users found with username: " + username);
        }
    }
    /**
     * Get all users
     */
    public List<User> findAll() {
        return entityManager.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    /**
     * Save a new user or update an existing one
     */
    @Transactional
    public User save(User user) {
        if (user.getUserId() == null) {
            entityManager.persist(user);
            return user;
        } else {
            return entityManager.merge(user);
        }
    }

    /**
     * Delete a user by their ID
     */
    @Transactional
    public void deleteById(Long id) {
        User user = entityManager.find(User.class, id);
        if (user != null) {
            entityManager.remove(user);
        }
    }

    /**
     * Check if a user exists by their ID
     */
    public boolean existsById(Long id) {
        return entityManager.find(User.class, id) != null;
    }

    /**
     * Check if a user exists by their username
     */
    public boolean existsByUsername(String username) {
        TypedQuery<Long> query = entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.username = :username", Long.class);
        query.setParameter("username", username);
        return query.getSingleResult() > 0;
    }
}