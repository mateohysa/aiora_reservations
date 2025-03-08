package com.aiora.reservation_backend.service;

import com.aiora.reservation_backend.api.auth.JwtUtil;
import com.aiora.reservation_backend.api.model.LoginBody;
import com.aiora.reservation_backend.dao.UserDao;
import com.aiora.reservation_backend.api.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.api.model.LoginResponse;
import com.aiora.reservation_backend.api.model.RegistrationBody;
import com.aiora.reservation_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse createUser(RegistrationBody registrationBody) {
        User user = new User();
        user.setUsername(registrationBody.getUsername());
        user.setFirstName(registrationBody.getFirstName());
        user.setLastName(registrationBody.getLastName());
        user.setPassword(passwordEncoder.encode(registrationBody.getPassword()));
        
        User savedUser = userDao.save(user);
        return convertToLoginResponse(savedUser);
    }

    public LoginResponse updateUser(Long id, RegistrationBody registrationBody) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setUsername(registrationBody.getUsername());
        user.setFirstName(registrationBody.getFirstName());
        user.setLastName(registrationBody.getLastName());
        
        if (registrationBody.getPassword() != null && !registrationBody.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(registrationBody.getPassword()));
        }
        
        User updatedUser = userDao.save(user);
        return convertToLoginResponse(updatedUser);
    }
    public Optional<User> findById(Long id) {
        return userDao.findById(id);
    }

    public LoginResponse getUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToLoginResponse(user);
    }
    // Update the login method to include JWT token generation
    public LoginResponse login(LoginBody loginBody) {
        User user = userDao.findByUsername(loginBody.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + loginBody.getUsername()));
                
        if (!passwordEncoder.matches(loginBody.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getUserId());
        
        // Create response with token
        LoginResponse response = convertToLoginResponse(user);
        response.setToken(token);
        
        return response;
    }
    public void deleteUser(Long id) {
        userDao.deleteById(id);
    }

    public List<LoginResponse> getAllUsers() {
        return userDao.findAll().stream()
                .map(this::convertToLoginResponse)
                .collect(Collectors.toList());
    }
    
    private LoginResponse convertToLoginResponse(User user) {
        LoginResponse response = new LoginResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        return response;
    }
}