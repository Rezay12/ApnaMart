package com.apnamart.dto.request;

import com.apnamart.enums.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CouponRequest {

    @NotBlank(message = "Coupon code is required")
    @Size(min = 3, max = 30, message = "Coupon code must be between 3 and 30 characters")
    private String code;

    @NotBlank(message = "Coupon title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    private String description;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType = DiscountType.FLAT;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.01", message = "Discount value must be greater than 0")
    private BigDecimal discountValue;

    private BigDecimal minOrderAmount = BigDecimal.ZERO;
    private BigDecimal maxDiscountAmount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer usageLimit;
    private Long storeId;
    private String badge;
    private Boolean active = true;

    public CouponRequest() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
