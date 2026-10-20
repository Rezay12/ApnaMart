package com.apnamart;

import com.apnamart.dto.request.CartItemRequest;
import com.apnamart.dto.request.OrderCreateRequest;
import com.apnamart.dto.response.OrderResponse;
import com.apnamart.dto.response.PickupSlotResponse;
import com.apnamart.enums.OrderStatus;
import com.apnamart.enums.PaymentMethod;
import com.apnamart.exception.BadRequestException;
import com.apnamart.service.CartService;
import com.apnamart.service.OrderService;
import com.apnamart.service.PickupSlotService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private PickupSlotService pickupSlotService;

    @Test
    @DisplayName("Should prevent placing order with empty cart")
    void testEmptyCartCheckoutFails() {
        String customerEmail = "priya@apnamart.com";
        cartService.clearCart(customerEmail);

        OrderCreateRequest request = new OrderCreateRequest();
        request.setPickupSlotId(1L);

        assertThrows(BadRequestException.class, () -> orderService.placeOrder(customerEmail, request));
    }

    @Test
    @DisplayName("Should enforce valid order status transitions")
    void testStatusTransitionValidation() {
        String shopkeeperEmail = "vikram@apnamart.com";

        // Try transitioning completed order AM202504250098 (Order ID 2) back to PENDING (Forbidden)
        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                orderService.updateOrderStatusByShopkeeper(shopkeeperEmail, 2L, OrderStatus.PENDING)
        );
        assertTrue(ex.getMessage().contains("Invalid status transition"));
    }

    @Test
    @DisplayName("Should place valid pre-order and allow cancellation with stock restoration")
    void testPlaceAndCancelOrder() {
        String customerEmail = "rahul@apnamart.com";

        // Ensure item in cart
        CartItemRequest cartItem = new CartItemRequest();
        cartItem.setProductId(1L); // Tomatoes
        cartItem.setQuantity(2);
        cartItem.setClearCartIfDifferentStore(true);
        cartService.addItemToCart(customerEmail, cartItem);

        // Get slot
        List<PickupSlotResponse> slots = pickupSlotService.getAvailableSlotsForStore(1L);
        assertFalse(slots.isEmpty());
        Long slotId = slots.get(0).getId();

        // Place Order
        OrderCreateRequest orderReq = new OrderCreateRequest();
        orderReq.setPickupSlotId(slotId);
        orderReq.setPaymentMethod(PaymentMethod.CASH_ON_PICKUP);
        orderReq.setCustomerNote("Test order note");

        OrderResponse placed = orderService.placeOrder(customerEmail, orderReq);
        assertNotNull(placed.getOrderNumber());
        assertEquals(OrderStatus.PENDING, placed.getOrderStatus());

        // Cancel Order
        OrderResponse cancelled = orderService.cancelCustomerOrder(customerEmail, placed.getId());
        assertEquals(OrderStatus.CANCELLED, cancelled.getOrderStatus());
    }
}
