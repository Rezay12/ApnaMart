package com.apnamart.service;

import com.apnamart.dto.request.CartItemRequest;
import com.apnamart.dto.response.CartResponse;

public interface CartService {
    CartResponse getCustomerCart(String customerEmail);
    CartResponse addItemToCart(String customerEmail, CartItemRequest request);
    CartResponse updateCartItemQuantity(String customerEmail, Long itemId, int quantity);
    CartResponse removeCartItem(String customerEmail, Long itemId);
    CartResponse clearCart(String customerEmail);
}
