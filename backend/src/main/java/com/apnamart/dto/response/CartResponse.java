package com.apnamart.dto.response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartResponse {
    private Long id;
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private List<CartItemResponse> items = new ArrayList<>();
    private Integer totalItems = 0;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal estimatedTax = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;

    public CartResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getStoreAddress() { return storeAddress; }
    public void setStoreAddress(String storeAddress) { this.storeAddress = storeAddress; }

    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getEstimatedTax() { return estimatedTax; }
    public void setEstimatedTax(BigDecimal estimatedTax) { this.estimatedTax = estimatedTax; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
