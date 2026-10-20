package com.apnamart.service;

import com.apnamart.dto.request.ProductRequest;
import com.apnamart.dto.response.ProductResponse;
import com.apnamart.entity.Product;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getStoreProducts(Long storeId, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String query);
    ProductResponse getProductById(Long productId);
    List<ProductResponse> getShopkeeperProducts(String shopkeeperEmail);
    ProductResponse addProduct(String shopkeeperEmail, ProductRequest request);
    ProductResponse updateProduct(String shopkeeperEmail, Long productId, ProductRequest request);
    void deleteProduct(String shopkeeperEmail, Long productId);
    Product getProductEntity(Long productId);
}
