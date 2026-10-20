package com.apnamart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CouponValidateRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    private Long storeId;

    @NotNull(message = "Subtotal is required")
    private BigDecimal subtotal;

    public CouponValidateRequest() {}

    public CouponValidateRequest(String code, Long storeId, BigDecimal subtotal) {
        this.code = code;
        this.storeId = storeId;
        this.subtotal = subtotal;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
