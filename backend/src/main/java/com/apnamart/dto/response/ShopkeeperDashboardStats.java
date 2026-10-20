package com.apnamart.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class ShopkeeperDashboardStats {
    private String storeName;
    private boolean approved;
    private boolean active;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalSales;
    private long totalProducts;
    private List<OrderResponse> recentOrders;

    public ShopkeeperDashboardStats() {}

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }
}
