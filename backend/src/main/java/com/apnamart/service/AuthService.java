package com.apnamart.service;

import com.apnamart.dto.request.LoginRequest;
import com.apnamart.dto.request.RegisterRequest;
import com.apnamart.dto.request.UserProfileRequest;
import com.apnamart.dto.response.AuthResponse;
import com.apnamart.entity.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User getCurrentUser(String email);
    User updateProfile(String email, UserProfileRequest request);
}
