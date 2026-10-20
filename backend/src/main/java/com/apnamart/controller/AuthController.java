package com.apnamart.controller;

import com.apnamart.dto.request.LoginRequest;
import com.apnamart.dto.request.RegisterRequest;
import com.apnamart.dto.request.UserProfileRequest;
import com.apnamart.dto.response.ApiResponse;
import com.apnamart.dto.response.AuthResponse;
import com.apnamart.entity.User;
import com.apnamart.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Authentication & Profile", description = "Endpoints for user registration, authentication, and profile")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    @Operation(summary = "Register new Customer or Shopkeeper account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/auth/login")
    @Operation(summary = "Authenticate user and generate JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/auth/me")
    @Operation(summary = "Get current authenticated user details")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/users/profile")
    @Operation(summary = "Update authenticated user profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                          @Valid @RequestBody UserProfileRequest request) {
        User updated = authService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
