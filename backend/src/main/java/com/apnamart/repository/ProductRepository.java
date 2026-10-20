package com.apnamart.repository;

import com.apnamart.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStoreIdAndActiveTrue(Long storeId);

    List<Product> findByStoreIdAndCategoryIdAndActiveTrue(Long storeId, Long categoryId);

    List<Product> findByStoreId(Long storeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND p.active = true AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:query IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> filterStoreProducts(
            @Param("storeId") Long storeId,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("query") String query
    );

    @Modifying
    @Query("UPDATE Product p SET p.availableQuantity = p.availableQuantity - :qty WHERE p.id = :id AND p.availableQuantity >= :qty")
    int decrementStockIfAvailable(@Param("id") Long id, @Param("qty") int qty);

    @Modifying
    @Query("UPDATE Product p SET p.availableQuantity = p.availableQuantity + :qty WHERE p.id = :id")
    int restoreStock(@Param("id") Long id, @Param("qty") int qty);

    long countByStoreIdAndActiveTrue(Long storeId);
}
