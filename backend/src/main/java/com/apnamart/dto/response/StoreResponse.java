package com.apnamart.dto.response;

import com.apnamart.entity.Store;
import com.apnamart.enums.StoreApprovalStatus;

import java.time.LocalTime;

public class StoreResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String storeName;
    private String description;
    private String address;
    private String locality;
    private String city;
    private String state;
    private String postalCode;
    private String phoneNumber;
    private String imageUrl;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private StoreApprovalStatus approvalStatus;
    private boolean active;
    private Double rating;
    private Integer reviewCount;
    private Double distanceKm;

    public StoreResponse() {}

    public static StoreResponse fromEntity(Store store) {
        StoreResponse res = new StoreResponse();
        res.setId(store.getId());
        if (store.getOwner() != null) {
            res.setOwnerId(store.getOwner().getId());
            res.setOwnerName(store.getOwner().getFullName());
        }
        res.setStoreName(store.getStoreName());
        res.setDescription(store.getDescription());
        res.setAddress(store.getAddress());
        res.setLocality(store.getLocality());
        res.setCity(store.getCity());
        res.setState(store.getState());
        res.setPostalCode(store.getPostalCode());
        res.setPhoneNumber(store.getPhoneNumber());
        res.setImageUrl(store.getImageUrl());
        res.setOpeningTime(store.getOpeningTime());
        res.setClosingTime(store.getClosingTime());
        res.setApprovalStatus(store.getApprovalStatus());
        res.setActive(store.isActive());
        res.setRating(store.getRating());
        res.setReviewCount(store.getReviewCount());
        res.setDistanceKm(store.getDistanceKm());
        return res;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalTime getOpeningTime() { return openingTime; }
    public void setOpeningTime(LocalTime openingTime) { this.openingTime = openingTime; }

    public LocalTime getClosingTime() { return closingTime; }
    public void setClosingTime(LocalTime closingTime) { this.closingTime = closingTime; }

    public StoreApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(StoreApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
}
