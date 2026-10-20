package com.apnamart.dto.request;

import com.apnamart.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class OrderCreateRequest {

    @NotNull(message = "Pickup slot ID is required")
    private Long pickupSlotId;

    private PaymentMethod paymentMethod = PaymentMethod.CASH_ON_PICKUP;
    private String customerNote;
    private String couponCode;

    public OrderCreateRequest() {}

    public Long getPickupSlotId() { return pickupSlotId; }
    public void setPickupSlotId(Long pickupSlotId) { this.pickupSlotId = pickupSlotId; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCustomerNote() { return customerNote; }
    public void setCustomerNote(String customerNote) { this.customerNote = customerNote; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
}
