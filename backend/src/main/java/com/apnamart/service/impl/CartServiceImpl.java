package com.apnamart.service.impl;

import com.apnamart.dto.request.CartItemRequest;
import com.apnamart.dto.response.CartItemResponse;
import com.apnamart.dto.response.CartResponse;
import com.apnamart.entity.Cart;
import com.apnamart.entity.CartItem;
import com.apnamart.entity.Product;
import com.apnamart.entity.Store;
import com.apnamart.entity.User;
import com.apnamart.exception.BadRequestException;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.repository.CartItemRepository;
import com.apnamart.repository.CartRepository;
import com.apnamart.repository.ProductRepository;
import com.apnamart.repository.UserRepository;
import com.apnamart.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CartResponse getCustomerCart(String customerEmail) {
        Cart cart = getOrCreateCart(customerEmail);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(String customerEmail, CartItemRequest request) {
        Cart cart = getOrCreateCart(customerEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!product.isActive()) {
            throw new BadRequestException("This product is no longer available");
        }

        if (product.getAvailableQuantity() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getAvailableQuantity() + " available)");
        }

        Store productStore = product.getStore();

        // Enforce: For the MVP, a cart must contain products from only one store at a time.
        if (cart.getStore() != null && !cart.getStore().getId().equals(productStore.getId()) && !cart.getItems().isEmpty()) {
            if (!request.isClearCartIfDifferentStore()) {
                throw new BadRequestException("CART_STORE_CONFLICT:" + cart.getStore().getStoreName());
            }
            // User confirmed: clear current cart and switch store
            cart.getItems().clear();
            cartItemRepository.deleteByCartId(cart.getId());
            cart.setStore(productStore);
        } else if (cart.getStore() == null) {
            cart.setStore(productStore);
        }

        // Check if item already exists in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQty = existingItem.getQuantity() + request.getQuantity();
            if (newQty > product.getAvailableQuantity()) {
                throw new BadRequestException("Cannot add more. Exceeds total available stock of " + product.getAvailableQuantity());
            }
            existingItem.setQuantity(newQty);
        } else {
            CartItem newItem = new CartItem(cart, product, request.getQuantity());
            cart.getItems().add(newItem);
        }

        Cart saved = cartRepository.save(cart);
        return toCartResponse(saved);
    }

    @Override
    @Transactional
    public CartResponse updateCartItemQuantity(String customerEmail, Long itemId, int quantity) {
        Cart cart = getOrCreateCart(customerEmail);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found in your cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (quantity > item.getProduct().getAvailableQuantity()) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + item.getProduct().getAvailableQuantity() + ")");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        if (cart.getItems().isEmpty()) {
            cart.setStore(null);
        }

        Cart saved = cartRepository.save(cart);
        return toCartResponse(saved);
    }

    @Override
    @Transactional
    public CartResponse removeCartItem(String customerEmail, Long itemId) {
        Cart cart = getOrCreateCart(customerEmail);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        if (cart.getItems().isEmpty()) {
            cart.setStore(null);
        }

        Cart saved = cartRepository.save(cart);
        return toCartResponse(saved);
    }

    @Override
    @Transactional
    public CartResponse clearCart(String customerEmail) {
        Cart cart = getOrCreateCart(customerEmail);
        cart.getItems().clear();
        cart.setStore(null);
        cartItemRepository.deleteByCartId(cart.getId());
        Cart saved = cartRepository.save(cart);
        return toCartResponse(saved);
    }

    private Cart getOrCreateCart(String customerEmail) {
        return cartRepository.findByCustomerEmail(customerEmail).orElseGet(() -> {
            User user = userRepository.findByEmail(customerEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    private CartResponse toCartResponse(Cart cart) {
        CartResponse res = new CartResponse();
        res.setId(cart.getId());
        if (cart.getStore() != null) {
            res.setStoreId(cart.getStore().getId());
            res.setStoreName(cart.getStore().getStoreName());
            res.setStoreAddress(cart.getStore().getAddress() + ", " + cart.getStore().getLocality() + ", " + cart.getStore().getCity());
        }

        List<CartItemResponse> itemDtos = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalQuantity = 0;

        for (CartItem item : cart.getItems()) {
            CartItemResponse itemDto = new CartItemResponse();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getProductName());
            itemDto.setPrice(item.getProduct().getPrice());
            itemDto.setUnit(item.getProduct().getUnit());
            itemDto.setImageUrl(item.getProduct().getImageUrl());
            itemDto.setAvailableQuantity(item.getProduct().getAvailableQuantity());
            itemDto.setQuantity(item.getQuantity());

            BigDecimal lineTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            itemDto.setLineTotal(lineTotal);

            subtotal = subtotal.add(lineTotal);
            totalQuantity += item.getQuantity();
            itemDtos.add(itemDto);
        }

        res.setItems(itemDtos);
        res.setTotalItems(totalQuantity);
        res.setSubtotal(subtotal);
        res.setEstimatedTax(BigDecimal.ZERO); // Pre-order store pickup tax ₹0
        res.setTotalAmount(subtotal);
        return res;
    }
}
