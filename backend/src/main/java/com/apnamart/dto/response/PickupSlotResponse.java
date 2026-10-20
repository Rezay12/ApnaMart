package com.apnamart.dto.response;

import com.apnamart.entity.PickupSlot;

import java.time.LocalDate;
import java.time.LocalTime;

public class PickupSlotResponse {
    private Long id;
    private Long storeId;
    private String storeName;
    private LocalDate pickupDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacity;
    private Integer reservedCount;
    private Integer availableSpots;
    private boolean available;

    public PickupSlotResponse() {}

    public static PickupSlotResponse fromEntity(PickupSlot slot) {
        PickupSlotResponse res = new PickupSlotResponse();
        res.setId(slot.getId());
        if (slot.getStore() != null) {
            res.setStoreId(slot.getStore().getId());
            res.setStoreName(slot.getStore().getStoreName());
        }
        res.setPickupDate(slot.getPickupDate());
        res.setStartTime(slot.getStartTime());
        res.setEndTime(slot.getEndTime());
        res.setCapacity(slot.getCapacity());
        res.setReservedCount(slot.getReservedCount());
        int avail = Math.max(0, slot.getCapacity() - slot.getReservedCount());
        res.setAvailableSpots(avail);
        res.setAvailable(slot.isActive() && avail > 0);
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public LocalDate getPickupDate() { return pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getReservedCount() { return reservedCount; }
    public void setReservedCount(Integer reservedCount) { this.reservedCount = reservedCount; }

    public Integer getAvailableSpots() { return availableSpots; }
    public void setAvailableSpots(Integer availableSpots) { this.availableSpots = availableSpots; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
