package com.apnamart.repository;

import com.apnamart.entity.Store;
import com.apnamart.enums.StoreApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByApprovalStatusAndActiveTrue(StoreApprovalStatus status);
    List<Store> findByApprovalStatus(StoreApprovalStatus status);
    Optional<Store> findByOwnerId(Long ownerId);
    boolean existsByOwnerId(Long ownerId);

    @Query("SELECT s FROM Store s WHERE s.approvalStatus = 'APPROVED' AND s.active = true AND " +
           "(LOWER(s.storeName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.locality) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.city) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Store> searchApprovedStores(@Param("query") String query);

    long countByApprovalStatus(StoreApprovalStatus status);
}
