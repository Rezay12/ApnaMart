package com.apnamart.controller;

import com.apnamart.dto.request.CategoryRequest;
import com.apnamart.dto.response.*;
import com.apnamart.entity.User;
import com.apnamart.enums.StoreApprovalStatus;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.repository.UserRepository;
import com.apnamart.service.CategoryService;
import com.apnamart.service.OrderService;
import com.apnamart.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Administrator Operations", description = "Endpoints for platform overview, store approvals, categories, and user management")
public class AdminController {

    private final OrderService orderService;
    private final StoreService storeService;
    private final CategoryService categoryService;
    private final UserRepository userRepository;

    public AdminController(OrderService orderService,
                           StoreService storeService,
                           CategoryService categoryService,
                           UserRepository userRepository) {
        this.orderService = orderService;
        this.storeService = storeService;
        this.categoryService = categoryService;
        this.userRepository = userRepository;
    }

    // --- Dashboard ---
    @GetMapping("/dashboard")
    @Operation(summary = "Get administrator dashboard metrics, revenue, and pending store approvals")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboard() {
        AdminDashboardStats stats = orderService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    // --- Stores Management ---
    @GetMapping("/stores")
    @Operation(summary = "List all stores with optional approvalStatus filter (PENDING, APPROVED, REJECTED)")
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getStores(
            @RequestParam(required = false) StoreApprovalStatus status) {
        List<StoreResponse> stores = storeService.getAllStoresForAdmin(status);
        return ResponseEntity.ok(ApiResponse.ok(stores));
    }

    @PatchMapping("/stores/{storeId}/approval")
    @Operation(summary = "Approve or reject a store registration")
    public ResponseEntity<ApiResponse<StoreResponse>> updateStoreApproval(
            @PathVariable Long storeId,
            @RequestParam StoreApprovalStatus status) {
        StoreResponse updated = storeService.updateStoreApproval(storeId, status);
        return ResponseEntity.ok(ApiResponse.ok("Store approval status updated to " + status, updated));
    }

    @PatchMapping("/stores/{storeId}/status")
    @Operation(summary = "Activate or deactivate a store")
    public ResponseEntity<ApiResponse<StoreResponse>> toggleStoreStatus(@PathVariable Long storeId) {
        StoreResponse updated = storeService.toggleStoreActive(storeId);
        return ResponseEntity.ok(ApiResponse.ok("Store status toggled", updated));
    }

    // --- Categories Management ---
    @GetMapping("/categories")
    @Operation(summary = "Get all categories including inactive")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new product category")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Category created successfully", category));
    }

    @PutMapping("/categories/{categoryId}")
    @Operation(summary = "Update an existing category")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse updated = categoryService.updateCategory(categoryId, request);
        return ResponseEntity.ok(ApiResponse.ok("Category updated successfully", updated));
    }

    @PatchMapping("/categories/{categoryId}/status")
    @Operation(summary = "Toggle active state of a category")
    public ResponseEntity<ApiResponse<CategoryResponse>> toggleCategoryStatus(@PathVariable Long categoryId) {
        CategoryResponse updated = categoryService.toggleCategoryStatus(categoryId);
        return ResponseEntity.ok(ApiResponse.ok("Category status toggled", updated));
    }

    // --- Users Management ---
    @GetMapping("/users")
    @Operation(summary = "List all platform users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{userId}/status")
    @Operation(summary = "Activate or suspend a user account")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("User status updated", saved));
    }

    // --- Orders Audit ---
    @GetMapping("/orders")
    @Operation(summary = "Platform-wide orders audit")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }
}
