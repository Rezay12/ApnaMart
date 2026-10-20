package com.apnamart.controller;

import com.apnamart.dto.request.OrderStatusUpdateRequest;
import com.apnamart.dto.request.PickupSlotRequest;
import com.apnamart.dto.request.ProductRequest;
import com.apnamart.dto.request.StoreRequest;
import com.apnamart.dto.response.*;
import com.apnamart.enums.OrderStatus;
import com.apnamart.service.OrderService;
import com.apnamart.service.PickupSlotService;
import com.apnamart.service.ProductService;
import com.apnamart.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shopkeeper")
@PreAuthorize("hasAuthority('ROLE_SHOPKEEPER')")
@Tag(name = "Shopkeeper Operations", description = "Endpoints for store profile, inventory, pickup slots, and order progression")
public class ShopkeeperController {

    private final StoreService storeService;
    private final ProductService productService;
    private final PickupSlotService pickupSlotService;
    private final OrderService orderService;

    public ShopkeeperController(StoreService storeService,
                                ProductService productService,
                                PickupSlotService pickupSlotService,
                                OrderService orderService) {
        this.storeService = storeService;
        this.productService = productService;
        this.pickupSlotService = pickupSlotService;
        this.orderService = orderService;
    }

    // --- Store Profile ---
    @GetMapping("/store")
    @Operation(summary = "Get authenticated shopkeeper's store details")
    public ResponseEntity<ApiResponse<StoreResponse>> getStore(@AuthenticationPrincipal UserDetails userDetails) {
        StoreResponse store = storeService.getStoreByOwnerEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(store));
    }

    @PostMapping("/store")
    @Operation(summary = "Register store profile for authenticated shopkeeper")
    public ResponseEntity<ApiResponse<StoreResponse>> createStore(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StoreRequest request) {
        StoreResponse store = storeService.createOrUpdateShopkeeperStore(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Store submitted successfully for admin approval", store));
    }

    @PutMapping("/store")
    @Operation(summary = "Update store profile and timings")
    public ResponseEntity<ApiResponse<StoreResponse>> updateStore(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StoreRequest request) {
        StoreResponse store = storeService.createOrUpdateShopkeeperStore(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Store profile updated successfully", store));
    }

    // --- Product Catalog ---
    @GetMapping("/products")
    @Operation(summary = "Get all products in shopkeeper's store")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProducts(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ProductResponse> products = productService.getShopkeeperProducts(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @PostMapping("/products")
    @Operation(summary = "Add a new product to shopkeeper's store")
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.addProduct(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Product added successfully", product));
    }

    @PutMapping("/products/{productId}")
    @Operation(summary = "Update product details, pricing, and stock quantity")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse updated = productService.updateProduct(userDetails.getUsername(), productId, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", updated));
    }

    @DeleteMapping("/products/{productId}")
    @Operation(summary = "Soft-delete product from store (preserves historical order accuracy)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        productService.deleteProduct(userDetails.getUsername(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Product removed successfully", null));
    }

    // --- Orders ---
    @GetMapping("/orders")
    @Operation(summary = "Get incoming pre-orders for shopkeeper's store with optional status filter")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) OrderStatus status) {
        List<OrderResponse> orders = orderService.getShopkeeperOrders(userDetails.getUsername(), status);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PatchMapping("/orders/{orderId}/status")
    @Operation(summary = "Transition order status (ACCEPT, REJECT, READY_FOR_PICKUP, COMPLETED)")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse updated = orderService.updateOrderStatusByShopkeeper(userDetails.getUsername(), orderId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", updated));
    }

    // --- Pickup Slots ---
    @GetMapping("/pickup-slots")
    @Operation(summary = "Get all pickup slots configured for shopkeeper's store")
    public ResponseEntity<ApiResponse<List<PickupSlotResponse>>> getPickupSlots(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PickupSlotResponse> slots = pickupSlotService.getShopkeeperSlots(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(slots));
    }

    @PostMapping("/pickup-slots")
    @Operation(summary = "Create a new pickup slot with capacity for shopkeeper's store")
    public ResponseEntity<ApiResponse<PickupSlotResponse>> createPickupSlot(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PickupSlotRequest request) {
        PickupSlotResponse slot = pickupSlotService.createSlot(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Pickup slot created successfully", slot));
    }

    @DeleteMapping("/pickup-slots/{slotId}")
    @Operation(summary = "Delete or deactivate a pickup slot")
    public ResponseEntity<ApiResponse<Void>> deletePickupSlot(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long slotId) {
        pickupSlotService.deleteSlot(userDetails.getUsername(), slotId);
        return ResponseEntity.ok(ApiResponse.ok("Pickup slot deactivated successfully", null));
    }

    // --- Dashboard ---
    @GetMapping("/dashboard")
    @Operation(summary = "Get shopkeeper dashboard stats (total sales, pending orders, total products)")
    public ResponseEntity<ApiResponse<ShopkeeperDashboardStats>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        ShopkeeperDashboardStats stats = orderService.getShopkeeperDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
