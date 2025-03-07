package com.aiora.reservation_backend.api.controller;

import com.aiora.reservation_backend.api.model.LoginBody;
import com.aiora.reservation_backend.api.model.LoginResponse;
import com.aiora.reservation_backend.api.model.RegistrationBody;
import com.aiora.reservation_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<LoginResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoginResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginBody loginBody) {
        return ResponseEntity.ok(userService.login(loginBody));
    }

    @PostMapping
    public ResponseEntity<LoginResponse> createUser(@Valid @RequestBody RegistrationBody registrationBody) {
        return new ResponseEntity<>(userService.createUser(registrationBody), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoginResponse> updateUser(@PathVariable Long id, @Valid @RequestBody RegistrationBody registrationBody) {
        return ResponseEntity.ok(userService.updateUser(id, registrationBody));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}