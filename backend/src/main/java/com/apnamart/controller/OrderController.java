package com.apnamart.controller;

import com.apnamart.dto.request.OrderCreateRequest;
import com.apnamart.dto.response.ApiResponse;
import com.apnamart.dto.response.CustomerDashboardStats;
import com.apnamart.dto.response.OrderResponse;
import com.apnamart.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Customer Orders", description = "Endpoints for customer pre-order preview, checkout, tracking, and cancellation")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders/preview")
    @Operation(summary = "Preview order totals, stock availability, and slot reservation before confirmation")
    public ResponseEntity<ApiResponse<OrderResponse>> previewOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long pickupSlotId,
            @RequestParam(required = false) String couponCode) {
        OrderResponse preview = orderService.previewOrder(userDetails.getUsername(), pickupSlotId, couponCode);
        return ResponseEntity.ok(ApiResponse.ok("Order preview generated", preview));
    }

    @PostMapping("/orders")
    @Operation(summary = "Place a pre-order with atomic stock and slot capacity reservation")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderCreateRequest request) {
        OrderResponse confirmedOrder = orderService.placeOrder(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order confirmed successfully", confirmedOrder));
    }

    @GetMapping("/orders/my")
    @Operation(summary = "Get current customer's order history")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<OrderResponse> orders = orderService.getCustomerOrders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Get specific order details")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {
        OrderResponse order = orderService.getOrderById(orderId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PatchMapping("/orders/{orderId}/cancel")
    @Operation(summary = "Cancel an order (allowed only if status is PENDING or ACCEPTED)")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {
        OrderResponse cancelledOrder = orderService.cancelCustomerOrder(userDetails.getUsername(), orderId);
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", cancelledOrder));
    }

    @GetMapping("/customer/dashboard")
    @Operation(summary = "Get customer dashboard statistics and recent orders")
    public ResponseEntity<ApiResponse<CustomerDashboardStats>> getCustomerDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        CustomerDashboardStats stats = orderService.getCustomerDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
