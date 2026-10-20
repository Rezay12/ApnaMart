package com.apnamart.service;

import com.apnamart.dto.request.PickupSlotRequest;
import com.apnamart.dto.response.PickupSlotResponse;

import java.util.List;

public interface PickupSlotService {
    List<PickupSlotResponse> getAvailableSlotsForStore(Long storeId);
    List<PickupSlotResponse> getShopkeeperSlots(String shopkeeperEmail);
    PickupSlotResponse createSlot(String shopkeeperEmail, PickupSlotRequest request);
    void deleteSlot(String shopkeeperEmail, Long slotId);
}
