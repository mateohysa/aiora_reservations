package com.aiora.reservation_backend.api.auth;

import com.aiora.reservation_backend.api.exception.ResourceNotFoundException;
import com.aiora.reservation_backend.api.model.LoginBody;
import com.aiora.reservation_backend.api.model.RegistrationBody;
import com.aiora.reservation_backend.dao.UserDao;
import com.aiora.reservation_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthService(UserDao userDao, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginBody loginBody) {
        User user = userDao.findByUsername(loginBody.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + loginBody.getUsername()));
                
        if (!passwordEncoder.matches(loginBody.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getUserId());
        return createAuthResponse(user, token);
    }

    public AuthResponse register(RegistrationBody registrationBody) {
        // Check if username already exists
        if (userDao.findByUsername(registrationBody.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        User user = new User();
        user.setUsername(registrationBody.getUsername());
        user.setFirstName(registrationBody.getFirstName());
        user.setLastName(registrationBody.getLastName());
        user.setPassword(passwordEncoder.encode(registrationBody.getPassword()));
        
        User savedUser = userDao.save(user);
        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getUserId());
        return createAuthResponse(savedUser, token);
    }

    private AuthResponse createAuthResponse(User user, String token) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        return response;
    }
}