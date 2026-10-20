package com.apnamart.repository;

import com.apnamart.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<Coupon> findByActiveTrue();

    List<Coupon> findByStoreId(Long storeId);

    List<Coupon> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c FROM Coupon c WHERE c.active = true AND (c.store IS NULL OR c.store.id = :storeId) ORDER BY c.createdAt DESC")
    List<Coupon> findAvailableCouponsForStore(@Param("storeId") Long storeId);

    @Query("SELECT c FROM Coupon c WHERE c.active = true AND c.store IS NULL ORDER BY c.createdAt DESC")
    List<Coupon> findPlatformWideActiveCoupons();
}
