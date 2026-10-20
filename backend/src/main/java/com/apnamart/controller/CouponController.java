package com.apnamart.controller;

import com.apnamart.dto.request.CouponRequest;
import com.apnamart.dto.request.CouponValidateRequest;
import com.apnamart.dto.response.ApiResponse;
import com.apnamart.dto.response.CouponResponse;
import com.apnamart.dto.response.CouponValidateResponse;
import com.apnamart.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/coupons")
@Tag(name = "Coupons & Offers", description = "Endpoints for discount coupons, limited-time offers, and promo code verification")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate a promo code against store and subtotal to preview discounts")
    public ResponseEntity<ApiResponse<CouponValidateResponse>> validateCoupon(
            @Valid @RequestBody CouponValidateRequest request) {
        CouponValidateResponse result = couponService.validateCoupon(
                request.getCode(),
                request.getStoreId(),
                request.getSubtotal()
        );
        return ResponseEntity.ok(ApiResponse.ok("Coupon validated", result));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available active coupons and limited-time offers for a store or platform")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAvailableCoupons(
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) BigDecimal subtotal) {
        List<CouponResponse> coupons = couponService.getAvailableCoupons(storeId, subtotal);
        return ResponseEntity.ok(ApiResponse.ok(coupons));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SHOPKEEPER')")
    @Operation(summary = "List all coupons (Admin and Shopkeeper)")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAllCoupons() {
        List<CouponResponse> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.ok(coupons));
    }

    @GetMapping("/store/{storeId}")
    @Operation(summary = "Get all coupons specific to a store")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getStoreCoupons(@PathVariable Long storeId) {
        List<CouponResponse> coupons = couponService.getStoreCoupons(storeId);
        return ResponseEntity.ok(ApiResponse.ok(coupons));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single coupon by ID")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponById(@PathVariable Long id) {
        CouponResponse coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(ApiResponse.ok(coupon));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SHOPKEEPER')")
    @Operation(summary = "Create a new discount coupon or limited-time promotional offer")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CouponRequest request) {
        CouponResponse created = couponService.createCoupon(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Coupon created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SHOPKEEPER')")
    @Operation(summary = "Update an existing coupon")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CouponRequest request) {
        CouponResponse updated = couponService.updateCoupon(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Coupon updated successfully", updated));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SHOPKEEPER')")
    @Operation(summary = "Toggle active status of a coupon")
    public ResponseEntity<ApiResponse<CouponResponse>> toggleCoupon(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        CouponResponse toggled = couponService.toggleCouponStatus(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Coupon status updated", toggled));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SHOPKEEPER')")
    @Operation(summary = "Delete a coupon")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        couponService.deleteCoupon(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Coupon deleted successfully", null));
    }
}
