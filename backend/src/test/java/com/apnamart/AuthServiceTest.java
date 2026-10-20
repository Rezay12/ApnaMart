package com.apnamart;

import com.apnamart.dto.request.LoginRequest;
import com.apnamart.dto.request.RegisterRequest;
import com.apnamart.dto.response.AuthResponse;
import com.apnamart.enums.Role;
import com.apnamart.exception.BadRequestException;
import com.apnamart.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Should prevent public user from registering as ROLE_ADMIN")
    void testAdminRegistrationForbidden() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("hacker@test.com");
        request.setPassword("Secret123");
        request.setFullName("Malicious User");
        request.setPhoneNumber("9999999999");
        request.setRole(Role.ROLE_ADMIN);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.register(request));
        assertTrue(ex.getMessage().contains("Administrator"));
    }

    @Test
    @DisplayName("Should register new customer and return JWT")
    void testCustomerRegistrationSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newcustomer@test.com");
        request.setPassword("Password123");
        request.setFullName("Test Customer");
        request.setPhoneNumber("9826077777");
        request.setRole(Role.ROLE_CUSTOMER);

        AuthResponse response = authService.register(request);
        assertNotNull(response.getToken());
        assertEquals("ROLE_CUSTOMER", response.getRole());
        assertEquals("newcustomer@test.com", response.getEmail());
    }

    @Test
    @DisplayName("Should login existing customer successfully")
    void testCustomerLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("rahul@apnamart.com");
        request.setPassword("Customer@123");

        AuthResponse response = authService.login(request);
        assertNotNull(response.getToken());
        assertEquals("ROLE_CUSTOMER", response.getRole());
    }
}
