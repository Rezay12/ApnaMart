package com.apnamart.service.impl;

import com.apnamart.dto.request.LoginRequest;
import com.apnamart.dto.request.RegisterRequest;
import com.apnamart.dto.request.UserProfileRequest;
import com.apnamart.dto.response.AuthResponse;
import com.apnamart.entity.Cart;
import com.apnamart.entity.User;
import com.apnamart.enums.Role;
import com.apnamart.exception.BadRequestException;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.repository.CartRepository;
import com.apnamart.repository.UserRepository;
import com.apnamart.security.JwtTokenProvider;
import com.apnamart.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           CartRepository cartRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Enforce: Public registration must never allow users to assign themselves the ADMIN role
        if (request.getRole() == Role.ROLE_ADMIN) {
            throw new BadRequestException("Public registration cannot create Administrator accounts");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        User user = new User(
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getPhoneNumber().trim(),
                request.getRole()
        );

        User savedUser = userRepository.save(user);

        // If customer, initialize their shopping cart
        if (savedUser.getRole() == Role.ROLE_CUSTOMER) {
            Cart cart = new Cart(savedUser);
            cartRepository.save(cart);
        }

        // Authenticate immediately and issue token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("Your account is deactivated. Please contact support.");
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    @Override
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public User updateProfile(String email, UserProfileRequest request) {
        User user = getCurrentUser(email);
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        return userRepository.save(user);
    }
}
