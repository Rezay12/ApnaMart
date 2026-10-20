package com.apnamart.dto.response;

import com.apnamart.enums.DiscountType;
import java.math.BigDecimal;

public class CouponValidateResponse {

    private boolean valid;
    private String message;
    private String code;
    private String title;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal subtotal;
    private BigDecimal finalTotal;
    private BigDecimal minOrderAmount;
    private String badge;
    private CouponResponse coupon;

    public CouponValidateResponse() {}

    public static CouponValidateResponse invalid(String message) {
        CouponValidateResponse res = new CouponValidateResponse();
        res.setValid(false);
        res.setMessage(message);
        res.setDiscountAmount(BigDecimal.ZERO);
        return res;
    }

    public static CouponValidateResponse success(String message, String code, String title,
                                                 DiscountType discountType, BigDecimal discountValue,
                                                 BigDecimal discountAmount, BigDecimal subtotal,
                                                 BigDecimal finalTotal, BigDecimal minOrderAmount,
                                                 String badge, CouponResponse coupon) {
        CouponValidateResponse res = new CouponValidateResponse();
        res.setValid(true);
        res.setMessage(message);
        res.setCode(code);
        res.setTitle(title);
        res.setDiscountType(discountType);
        res.setDiscountValue(discountValue);
        res.setDiscountAmount(discountAmount);
        res.setSubtotal(subtotal);
        res.setFinalTotal(finalTotal);
        res.setMinOrderAmount(minOrderAmount);
        res.setBadge(badge);
        res.setCoupon(coupon);
        return res;
    }

    // Getters and Setters
    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getFinalTotal() { return finalTotal; }
    public void setFinalTotal(BigDecimal finalTotal) { this.finalTotal = finalTotal; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public CouponResponse getCoupon() { return coupon; }
    public void setCoupon(CouponResponse coupon) { this.coupon = coupon; }
}
