package com.apnamart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100)
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    public UserProfileRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
