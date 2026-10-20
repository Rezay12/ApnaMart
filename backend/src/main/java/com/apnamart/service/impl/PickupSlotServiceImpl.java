package com.apnamart.service.impl;

import com.apnamart.dto.request.PickupSlotRequest;
import com.apnamart.dto.response.PickupSlotResponse;
import com.apnamart.entity.PickupSlot;
import com.apnamart.entity.Store;
import com.apnamart.entity.User;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.exception.UnauthorizedException;
import com.apnamart.repository.PickupSlotRepository;
import com.apnamart.repository.StoreRepository;
import com.apnamart.repository.UserRepository;
import com.apnamart.service.PickupSlotService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PickupSlotServiceImpl implements PickupSlotService {

    private final PickupSlotRepository pickupSlotRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public PickupSlotServiceImpl(PickupSlotRepository pickupSlotRepository,
                                 StoreRepository storeRepository,
                                 UserRepository userRepository) {
        this.pickupSlotRepository = pickupSlotRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<PickupSlotResponse> getAvailableSlotsForStore(Long storeId) {
        LocalDate today = LocalDate.now();
        List<PickupSlot> slots = pickupSlotRepository
                .findByStoreIdAndPickupDateGreaterThanEqualAndActiveTrueOrderByPickupDateAscStartTimeAsc(storeId, today);

        return slots.stream()
                .filter(PickupSlot::hasAvailableCapacity)
                .map(PickupSlotResponse::fromEntity)
                .toList();
    }

    @Override
    public List<PickupSlotResponse> getShopkeeperSlots(String shopkeeperEmail) {
        Store store = getShopkeeperStore(shopkeeperEmail);
        return pickupSlotRepository.findByStoreIdOrderByPickupDateAscStartTimeAsc(store.getId()).stream()
                .map(PickupSlotResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public PickupSlotResponse createSlot(String shopkeeperEmail, PickupSlotRequest request) {
        Store store = getShopkeeperStore(shopkeeperEmail);

        PickupSlot slot = new PickupSlot();
        slot.setStore(store);
        slot.setPickupDate(request.getPickupDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacity(request.getCapacity());
        slot.setReservedCount(0);
        slot.setActive(true);

        PickupSlot saved = pickupSlotRepository.save(slot);
        return PickupSlotResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteSlot(String shopkeeperEmail, Long slotId) {
        Store store = getShopkeeperStore(shopkeeperEmail);
        PickupSlot slot = pickupSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + slotId));

        if (!slot.getStore().getId().equals(store.getId())) {
            throw new UnauthorizedException("Unauthorized to modify pickup slot from another store");
        }

        slot.setActive(false);
        pickupSlotRepository.save(slot);
    }

    private Store getShopkeeperStore(String shopkeeperEmail) {
        User user = userRepository.findByEmail(shopkeeperEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));
        return storeRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found for this shopkeeper"));
    }
}
