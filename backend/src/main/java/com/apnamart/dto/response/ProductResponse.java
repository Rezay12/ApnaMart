package com.apnamart.dto.response;

import com.apnamart.entity.Product;

import java.math.BigDecimal;

public class ProductResponse {
    private Long id;
    private Long storeId;
    private String storeName;
    private Long categoryId;
    private String categoryName;
    private String productName;
    private String description;
    private String sku;
    private BigDecimal price;
    private Integer availableQuantity;
    private String unit;
    private String imageUrl;
    private boolean active;
    private boolean inStock;

    public ProductResponse() {}

    public static ProductResponse fromEntity(Product product) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        if (product.getStore() != null) {
            res.setStoreId(product.getStore().getId());
            res.setStoreName(product.getStore().getStoreName());
        }
        if (product.getCategory() != null) {
            res.setCategoryId(product.getCategory().getId());
            res.setCategoryName(product.getCategory().getName());
        }
        res.setProductName(product.getProductName());
        res.setDescription(product.getDescription());
        res.setSku(product.getSku());
        res.setPrice(product.getPrice());
        res.setAvailableQuantity(product.getAvailableQuantity());
        res.setUnit(product.getUnit());
        res.setImageUrl(product.getImageUrl());
        res.setActive(product.isActive());
        res.setInStock(product.isActive() && product.getAvailableQuantity() != null && product.getAvailableQuantity() > 0);
        return res;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }
}
