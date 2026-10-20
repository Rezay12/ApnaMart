package com.apnamart.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "pickup_slots")
public class PickupSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "pickup_date", nullable = false)
    private LocalDate pickupDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer capacity = 10;

    @Column(name = "reserved_count", nullable = false)
    private Integer reservedCount = 0;

    @Column(nullable = false)
    private boolean active = true;

    public PickupSlot() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Store getStore() { return store; }
    public void setStore(Store store) { this.store = store; }

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

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean hasAvailableCapacity() {
        return active && (reservedCount < capacity);
    }
}
