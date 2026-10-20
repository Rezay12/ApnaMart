package com.apnamart.dto.request;

import com.apnamart.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    public OrderStatusUpdateRequest() {}

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
