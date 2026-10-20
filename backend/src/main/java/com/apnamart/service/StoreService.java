package com.apnamart.service;

import com.apnamart.dto.request.StoreRequest;
import com.apnamart.dto.response.StoreResponse;
import com.apnamart.entity.Store;
import com.apnamart.enums.StoreApprovalStatus;

import java.util.List;

public interface StoreService {
    List<StoreResponse> getApprovedStores(String query);
    StoreResponse getStoreById(Long storeId);
    StoreResponse getStoreByOwnerEmail(String ownerEmail);
    StoreResponse createOrUpdateShopkeeperStore(String ownerEmail, StoreRequest request);
    List<StoreResponse> getAllStoresForAdmin(StoreApprovalStatus statusFilter);
    StoreResponse updateStoreApproval(Long storeId, StoreApprovalStatus status);
    StoreResponse toggleStoreActive(Long storeId);
    Store getStoreEntity(Long storeId);
}
