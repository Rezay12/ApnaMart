package com.apnamart.dto.response;

import java.util.List;

public class CustomerDashboardStats {
    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
    private long cancelledOrders;
    private List<OrderResponse> recentOrders;

    public CustomerDashboardStats() {}

    public CustomerDashboardStats(long totalOrders, long pendingOrders, long completedOrders, long cancelledOrders, List<OrderResponse> recentOrders) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.recentOrders = recentOrders;
    }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }
}
