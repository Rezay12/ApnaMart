package com.apnamart.service.impl;

import com.apnamart.dto.request.StoreRequest;
import com.apnamart.dto.response.StoreResponse;
import com.apnamart.entity.Store;
import com.apnamart.entity.User;
import com.apnamart.enums.Role;
import com.apnamart.enums.StoreApprovalStatus;
import com.apnamart.exception.BadRequestException;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.exception.UnauthorizedException;
import com.apnamart.repository.StoreRepository;
import com.apnamart.repository.UserRepository;
import com.apnamart.service.StoreService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public StoreServiceImpl(StoreRepository storeRepository, UserRepository userRepository) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<StoreResponse> getApprovedStores(String query) {
        List<Store> stores;
        if (StringUtils.hasText(query)) {
            stores = storeRepository.searchApprovedStores(query.trim());
        } else {
            stores = storeRepository.findByApprovalStatusAndActiveTrue(StoreApprovalStatus.APPROVED);
        }
        return stores.stream().map(StoreResponse::fromEntity).toList();
    }

    @Override
    public StoreResponse getStoreById(Long storeId) {
        Store store = getStoreEntity(storeId);
        return StoreResponse.fromEntity(store);
    }

    @Override
    public StoreResponse getStoreByOwnerEmail(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Store store = storeRepository.findByOwnerId(owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No store registered yet for this shopkeeper account"));

        return StoreResponse.fromEntity(store);
    }

    @Override
    @Transactional
    public StoreResponse createOrUpdateShopkeeperStore(String ownerEmail, StoreRequest request) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (owner.getRole() != Role.ROLE_SHOPKEEPER) {
            throw new UnauthorizedException("Only shopkeepers can manage store profiles");
        }

        Store store = storeRepository.findByOwnerId(owner.getId()).orElse(null);

        if (store == null) {
            store = new Store();
            store.setOwner(owner);
            store.setApprovalStatus(StoreApprovalStatus.PENDING); // newly registered store requires Admin approval
            store.setActive(true);
        }

        store.setStoreName(request.getStoreName().trim());
        store.setDescription(request.getDescription());
        store.setAddress(request.getAddress().trim());
        store.setLocality(request.getLocality().trim());
        store.setCity(request.getCity().trim());
        store.setState(request.getState().trim());
        store.setPostalCode(request.getPostalCode().trim());
        store.setPhoneNumber(request.getPhoneNumber().trim());
        if (StringUtils.hasText(request.getImageUrl())) {
            store.setImageUrl(request.getImageUrl());
        }
        store.setOpeningTime(request.getOpeningTime());
        store.setClosingTime(request.getClosingTime());

        Store saved = storeRepository.save(store);
        return StoreResponse.fromEntity(saved);
    }

    @Override
    public List<StoreResponse> getAllStoresForAdmin(StoreApprovalStatus statusFilter) {
        List<Store> stores = (statusFilter != null)
                ? storeRepository.findByApprovalStatus(statusFilter)
                : storeRepository.findAll();
        return stores.stream().map(StoreResponse::fromEntity).toList();
    }

    @Override
    @Transactional
    public StoreResponse updateStoreApproval(Long storeId, StoreApprovalStatus status) {
        Store store = getStoreEntity(storeId);
        store.setApprovalStatus(status);
        return StoreResponse.fromEntity(storeRepository.save(store));
    }

    @Override
    @Transactional
    public StoreResponse toggleStoreActive(Long storeId) {
        Store store = getStoreEntity(storeId);
        store.setActive(!store.isActive());
        return StoreResponse.fromEntity(storeRepository.save(store));
    }

    @Override
    public Store getStoreEntity(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
    }
}
