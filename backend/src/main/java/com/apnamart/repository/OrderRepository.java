package com.apnamart.repository;

import com.apnamart.entity.Order;
import com.apnamart.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCustomerEmailOrderByCreatedAtDesc(String email);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Order> findByStoreIdOrderByCreatedAtDesc(Long storeId);

    List<Order> findByStoreOwnerEmailOrderByCreatedAtDesc(String email);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndOrderStatus(Long customerId, OrderStatus status);

    long countByStoreId(Long storeId);

    long countByStoreIdAndOrderStatus(Long storeId, OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.store.id = :storeId AND o.orderStatus IN ('ACCEPTED', 'READY_FOR_PICKUP', 'COMPLETED')")
    BigDecimal calculateStoreRevenue(@Param("storeId") Long storeId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus IN ('ACCEPTED', 'READY_FOR_PICKUP', 'COMPLETED')")
    BigDecimal calculateTotalPlatformRevenue();

    List<Order> findAllByOrderByCreatedAtDesc();
}
