package com.apnamart.service;

import com.apnamart.dto.request.OrderCreateRequest;
import com.apnamart.dto.response.*;
import com.apnamart.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderResponse previewOrder(String customerEmail, Long pickupSlotId);
    OrderResponse previewOrder(String customerEmail, Long pickupSlotId, String couponCode);
    OrderResponse placeOrder(String customerEmail, OrderCreateRequest request);
    List<OrderResponse> getCustomerOrders(String customerEmail);
    OrderResponse getOrderById(Long orderId, String userEmail);
    OrderResponse cancelCustomerOrder(String customerEmail, Long orderId);

    List<OrderResponse> getShopkeeperOrders(String shopkeeperEmail, OrderStatus statusFilter);
    OrderResponse updateOrderStatusByShopkeeper(String shopkeeperEmail, Long orderId, OrderStatus nextStatus);

    CustomerDashboardStats getCustomerDashboardStats(String customerEmail);
    ShopkeeperDashboardStats getShopkeeperDashboardStats(String shopkeeperEmail);
    AdminDashboardStats getAdminDashboardStats();
    List<OrderResponse> getAllOrdersForAdmin();
}
