package com.apnamart.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardStats {
    private long totalUsers;
    private long totalStores;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private List<StoreResponse> pendingApprovals;
    private List<Map<String, Object>> dailyOrderCounts;

    public AdminDashboardStats() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalStores() { return totalStores; }
    public void setTotalStores(long totalStores) { this.totalStores = totalStores; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<StoreResponse> getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(List<StoreResponse> pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public List<Map<String, Object>> getDailyOrderCounts() { return dailyOrderCounts; }
    public void setDailyOrderCounts(List<Map<String, Object>> dailyOrderCounts) { this.dailyOrderCounts = dailyOrderCounts; }
}
