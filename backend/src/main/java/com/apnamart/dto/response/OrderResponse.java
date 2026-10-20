package com.apnamart.dto.response;

import com.apnamart.entity.Order;
import com.apnamart.enums.OrderStatus;
import com.apnamart.enums.PaymentMethod;
import com.apnamart.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private Long pickupSlotId;
    private String pickupDate;
    private String pickupTime;
    private BigDecimal subtotal;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private String couponCode;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String customerNote;
    private List<OrderItemResponse> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {}

    public static OrderResponse fromEntity(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setOrderNumber(order.getOrderNumber());
        if (order.getCustomer() != null) {
            res.setCustomerId(order.getCustomer().getId());
            res.setCustomerName(order.getCustomer().getFullName());
            res.setCustomerEmail(order.getCustomer().getEmail());
            res.setCustomerPhone(order.getCustomer().getPhoneNumber());
        }
        if (order.getStore() != null) {
            res.setStoreId(order.getStore().getId());
            res.setStoreName(order.getStore().getStoreName());
            res.setStoreAddress(order.getStore().getAddress() + ", " + order.getStore().getLocality() + ", " + order.getStore().getCity());
            res.setStorePhone(order.getStore().getPhoneNumber());
        }
        if (order.getPickupSlot() != null) {
            res.setPickupSlotId(order.getPickupSlot().getId());
            res.setPickupDate(order.getPickupSlot().getPickupDate().toString());
            res.setPickupTime(order.getPickupSlot().getStartTime() + " - " + order.getPickupSlot().getEndTime());
        }
        res.setSubtotal(order.getSubtotal());
        res.setDiscountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO);
        res.setCouponCode(order.getCouponCode());
        res.setTotalAmount(order.getTotalAmount());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setPaymentStatus(order.getPaymentStatus());
        res.setOrderStatus(order.getOrderStatus());
        res.setCustomerNote(order.getCustomerNote());
        res.setCreatedAt(order.getCreatedAt());
        res.setUpdatedAt(order.getUpdatedAt());

        if (order.getItems() != null) {
            List<OrderItemResponse> itemDtos = order.getItems().stream().map(item -> {
                OrderItemResponse r = new OrderItemResponse();
                r.setId(item.getId());
                if (item.getProduct() != null) {
                    r.setProductId(item.getProduct().getId());
                }
                r.setProductName(item.getProductNameSnapshot());
                r.setUnitPrice(item.getUnitPriceSnapshot());
                r.setQuantity(item.getQuantity());
                r.setLineTotal(item.getLineTotal());
                return r;
            }).toList();
            res.setItems(itemDtos);
        }

        return res;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getStoreAddress() { return storeAddress; }
    public void setStoreAddress(String storeAddress) { this.storeAddress = storeAddress; }

    public String getStorePhone() { return storePhone; }
    public void setStorePhone(String storePhone) { this.storePhone = storePhone; }

    public Long getPickupSlotId() { return pickupSlotId; }
    public void setPickupSlotId(Long pickupSlotId) { this.pickupSlotId = pickupSlotId; }

    public String getPickupDate() { return pickupDate; }
    public void setPickupDate(String pickupDate) { this.pickupDate = pickupDate; }

    public String getPickupTime() { return pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public String getCustomerNote() { return customerNote; }
    public void setCustomerNote(String customerNote) { this.customerNote = customerNote; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
