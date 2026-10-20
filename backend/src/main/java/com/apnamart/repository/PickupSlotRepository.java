package com.apnamart.repository;

import com.apnamart.entity.PickupSlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PickupSlotRepository extends JpaRepository<PickupSlot, Long> {

    List<PickupSlot> findByStoreIdAndPickupDateGreaterThanEqualAndActiveTrueOrderByPickupDateAscStartTimeAsc(
            Long storeId, LocalDate date);

    List<PickupSlot> findByStoreIdOrderByPickupDateAscStartTimeAsc(Long storeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM PickupSlot s WHERE s.id = :id")
    Optional<PickupSlot> findByIdWithLock(@Param("id") Long id);

    @Modifying
    @Query("UPDATE PickupSlot s SET s.reservedCount = s.reservedCount + 1 WHERE s.id = :id AND s.reservedCount < s.capacity")
    int reserveCapacityIfAvailable(@Param("id") Long id);

    @Modifying
    @Query("UPDATE PickupSlot s SET s.reservedCount = s.reservedCount - 1 WHERE s.id = :id AND s.reservedCount > 0")
    int releaseCapacity(@Param("id") Long id);
}
