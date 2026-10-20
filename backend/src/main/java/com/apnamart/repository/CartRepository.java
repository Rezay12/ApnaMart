package com.apnamart.repository;

import com.apnamart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomerId(Long customerId);
    Optional<Cart> findByCustomerEmail(String email);
}
