package com.apnamart.dto.response;

import com.apnamart.entity.Coupon;
import com.apnamart.enums.DiscountType;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

public class CouponResponse {

    private Long id;
    private String code;
    private String title;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private int timesUsed;
    private Long storeId;
    private String storeName;
    private String badge;
    private boolean active;
    private boolean isCurrentlyValid;
    private boolean isLimitedTime;
    private String timeRemainingFormatted;
    private LocalDateTime createdAt;

    public CouponResponse() {}

    public static CouponResponse fromEntity(Coupon coupon) {
        if (coupon == null) return null;

        CouponResponse res = new CouponResponse();
        res.setId(coupon.getId());
        res.setCode(coupon.getCode());
        res.setTitle(coupon.getTitle());
        res.setDescription(coupon.getDescription());
        res.setDiscountType(coupon.getDiscountType());
        res.setDiscountValue(coupon.getDiscountValue());
        res.setMinOrderAmount(coupon.getMinOrderAmount());
        res.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        res.setStartDate(coupon.getStartDate());
        res.setEndDate(coupon.getEndDate());
        res.setUsageLimit(coupon.getUsageLimit());
        res.setTimesUsed(coupon.getTimesUsed());
        if (coupon.getStore() != null) {
            res.setStoreId(coupon.getStore().getId());
            res.setStoreName(coupon.getStore().getStoreName());
        } else {
            res.setStoreName("All Stores (Platform-wide)");
        }
        res.setBadge(coupon.getBadge());
        res.setActive(coupon.isActive());
        res.setCurrentlyValid(coupon.isCurrentlyValid());
        res.setCreatedAt(coupon.getCreatedAt());

        if (coupon.getEndDate() != null) {
            res.setLimitedTime(true);
            LocalDateTime now = LocalDateTime.now();
            if (now.isAfter(coupon.getEndDate())) {
                res.setTimeRemainingFormatted("Expired");
            } else {
                Duration duration = Duration.between(now, coupon.getEndDate());
                long days = duration.toDays();
                long hours = duration.toHoursPart();
                long minutes = duration.toMinutesPart();
                if (days > 0) {
                    res.setTimeRemainingFormatted(days + "d " + hours + "h left");
                } else if (hours > 0) {
                    res.setTimeRemainingFormatted(hours + "h " + minutes + "m left");
                } else {
                    res.setTimeRemainingFormatted(minutes + "m left");
                }
            }
        } else {
            res.setLimitedTime(false);
            res.setTimeRemainingFormatted(null);
        }

        return res;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public int getTimesUsed() { return timesUsed; }
    public void setTimesUsed(int timesUsed) { this.timesUsed = timesUsed; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isCurrentlyValid() { return isCurrentlyValid; }
    public void setCurrentlyValid(boolean currentlyValid) { isCurrentlyValid = currentlyValid; }

    public boolean isLimitedTime() { return isLimitedTime; }
    public void setLimitedTime(boolean limitedTime) { isLimitedTime = limitedTime; }

    public String getTimeRemainingFormatted() { return timeRemainingFormatted; }
    public void setTimeRemainingFormatted(String timeRemainingFormatted) { this.timeRemainingFormatted = timeRemainingFormatted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
