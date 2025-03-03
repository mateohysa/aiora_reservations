package com.aiora.reservation_backend.service;

import com.aiora.reservation_backend.dao.UserDao;
import com.aiora.reservation_backend.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDao.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setUsername(userDetails.getUsername());
        
        return userDao.save(user);
    }

    public void deleteUser(Long id) {
        if (!userDao.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userDao.deleteById(id);
    }

    public User getUser(Long id) {
        return userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public List<User> getAllUsers() {
        return userDao.findAll();
    }
}