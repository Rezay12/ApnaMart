package com.apnamart.service.impl;

import com.apnamart.dto.request.ProductRequest;
import com.apnamart.dto.response.ProductResponse;
import com.apnamart.entity.Category;
import com.apnamart.entity.Product;
import com.apnamart.entity.Store;
import com.apnamart.entity.User;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.exception.UnauthorizedException;
import com.apnamart.repository.ProductRepository;
import com.apnamart.repository.StoreRepository;
import com.apnamart.repository.UserRepository;
import com.apnamart.service.CategoryService;
import com.apnamart.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final CategoryService categoryService;

    public ProductServiceImpl(ProductRepository productRepository,
                              StoreRepository storeRepository,
                              UserRepository userRepository,
                              CategoryService categoryService) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.categoryService = categoryService;
    }

    @Override
    public List<ProductResponse> getStoreProducts(Long storeId, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String query) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        List<Product> products = productRepository.filterStoreProducts(storeId, categoryId, minPrice, maxPrice, cleanQuery);
        return products.stream().map(ProductResponse::fromEntity).toList();
    }

    @Override
    public ProductResponse getProductById(Long productId) {
        Product product = getProductEntity(productId);
        return ProductResponse.fromEntity(product);
    }

    @Override
    public List<ProductResponse> getShopkeeperProducts(String shopkeeperEmail) {
        Store store = getShopkeeperStore(shopkeeperEmail);
        return productRepository.findByStoreId(store.getId()).stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public ProductResponse addProduct(String shopkeeperEmail, ProductRequest request) {
        Store store = getShopkeeperStore(shopkeeperEmail);
        Category category = categoryService.getCategoryEntity(request.getCategoryId());

        Product product = new Product();
        product.setStore(store);
        product.setCategory(category);
        product.setProductName(request.getProductName().trim());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setAvailableQuantity(request.getAvailableQuantity());
        product.setUnit(request.getUnit().trim());
        product.setImageUrl(request.getImageUrl());
        product.setActive(true);

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(String shopkeeperEmail, Long productId, ProductRequest request) {
        Store store = getShopkeeperStore(shopkeeperEmail);
        Product product = getProductEntity(productId);

        if (!product.getStore().getId().equals(store.getId())) {
            throw new UnauthorizedException("You are not authorized to update products in another store");
        }

        Category category = categoryService.getCategoryEntity(request.getCategoryId());
        product.setCategory(category);
        product.setProductName(request.getProductName().trim());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setAvailableQuantity(request.getAvailableQuantity());
        product.setUnit(request.getUnit().trim());
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteProduct(String shopkeeperEmail, Long productId) {
        Store store = getShopkeeperStore(shopkeeperEmail);
        Product product = getProductEntity(productId);

        if (!product.getStore().getId().equals(store.getId())) {
            throw new UnauthorizedException("You are not authorized to delete products from another store");
        }

        // Soft deletion ensures previous orders referencing this product remain intact
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public Product getProductEntity(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    private Store getShopkeeperStore(String shopkeeperEmail) {
        User user = userRepository.findByEmail(shopkeeperEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));
        return storeRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found for this shopkeeper. Please create store profile first."));
    }
}
