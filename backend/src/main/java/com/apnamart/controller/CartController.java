package com.apnamart.controller;

import com.apnamart.dto.request.CartItemRequest;
import com.apnamart.dto.request.UpdateCartItemRequest;
import com.apnamart.dto.response.ApiResponse;
import com.apnamart.dto.response.CartResponse;
import com.apnamart.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@Tag(name = "Customer Cart", description = "Endpoints for managing the customer cart with single-store enforcement")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current customer's cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        CartResponse cart = cartService.getCustomerCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add product to cart (supports clearCartIfDifferentStore flag)")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartItemRequest request) {
        CartResponse updatedCart = cartService.addItemToCart(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", updatedCart));
    }

    @PatchMapping("/items/{itemId}")
    @Operation(summary = "Update quantity of a cart item")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse updatedCart = cartService.updateCartItemQuantity(userDetails.getUsername(), itemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.ok("Cart updated", updatedCart));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove an item from cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        CartResponse updatedCart = cartService.removeCartItem(userDetails.getUsername(), itemId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", updatedCart));
    }

    @DeleteMapping
    @Operation(summary = "Clear customer's cart")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        CartResponse emptyCart = cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", emptyCart));
    }
}
