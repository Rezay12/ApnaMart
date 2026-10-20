package com.apnamart.controller;

import com.apnamart.dto.response.ApiResponse;
import com.apnamart.dto.response.PickupSlotResponse;
import com.apnamart.dto.response.ProductResponse;
import com.apnamart.dto.response.StoreResponse;
import com.apnamart.service.PickupSlotService;
import com.apnamart.service.ProductService;
import com.apnamart.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/stores")
@Tag(name = "Stores (Public)", description = "Public endpoints for exploring nearby Kirana and Department stores")
public class StoreController {

    private final StoreService storeService;
    private final ProductService productService;
    private final PickupSlotService pickupSlotService;

    public StoreController(StoreService storeService,
                           ProductService productService,
                           PickupSlotService pickupSlotService) {
        this.storeService = storeService;
        this.productService = productService;
        this.pickupSlotService = pickupSlotService;
    }

    @GetMapping
    @Operation(summary = "List approved and active stores, optionally filtered by search query")
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getApprovedStores(
            @RequestParam(required = false) String query) {
        List<StoreResponse> stores = storeService.getApprovedStores(query);
        return ResponseEntity.ok(ApiResponse.ok(stores));
    }

    @GetMapping("/{storeId}")
    @Operation(summary = "Get detailed store profile by ID")
    public ResponseEntity<ApiResponse<StoreResponse>> getStoreById(@PathVariable Long storeId) {
        StoreResponse store = storeService.getStoreById(storeId);
        return ResponseEntity.ok(ApiResponse.ok(store));
    }

    @GetMapping("/{storeId}/products")
    @Operation(summary = "Get products belonging to a store with filtering by category, price, and query")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getStoreProducts(
            @PathVariable Long storeId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String query) {
        List<ProductResponse> products = productService.getStoreProducts(storeId, categoryId, minPrice, maxPrice, query);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/{storeId}/pickup-slots")
    @Operation(summary = "Get available future pickup slots with remaining capacity")
    public ResponseEntity<ApiResponse<List<PickupSlotResponse>>> getStorePickupSlots(@PathVariable Long storeId) {
        List<PickupSlotResponse> slots = pickupSlotService.getAvailableSlotsForStore(storeId);
        return ResponseEntity.ok(ApiResponse.ok(slots));
    }
}
