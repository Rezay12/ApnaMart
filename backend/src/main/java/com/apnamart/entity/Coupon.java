package com.apnamart.entity;

import com.apnamart.enums.DiscountType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType = DiscountType.FLAT;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "times_used", nullable = false)
    private int timesUsed = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "store_id")
    private Store store;

    @Column(length = 60)
    private String badge;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Coupon() {}

    public Coupon(String code, String title, String description, DiscountType discountType,
                  BigDecimal discountValue, BigDecimal minOrderAmount, BigDecimal maxDiscountAmount,
                  LocalDateTime startDate, LocalDateTime endDate, Integer usageLimit,
                  Store store, String badge) {
        this.code = code != null ? code.toUpperCase().trim() : null;
        this.title = title;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount != null ? minOrderAmount : BigDecimal.ZERO;
        this.maxDiscountAmount = maxDiscountAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.usageLimit = usageLimit;
        this.store = store;
        this.badge = badge;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.code != null) {
            this.code = this.code.toUpperCase().trim();
        }
        if (this.minOrderAmount == null) {
            this.minOrderAmount = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.code != null) {
            this.code = this.code.toUpperCase().trim();
        }
    }

    public boolean isCurrentlyValid() {
        if (!active) return false;
        if (usageLimit != null && timesUsed >= usageLimit) return false;
        LocalDateTime now = LocalDateTime.now();
        if (startDate != null && now.isBefore(startDate)) return false;
        if (endDate != null && now.isAfter(endDate)) return false;
        return true;
    }

    public BigDecimal calculateDiscount(BigDecimal orderSubtotal) {
        if (orderSubtotal == null || orderSubtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (minOrderAmount != null && orderSubtotal.compareTo(minOrderAmount) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;
        if (discountType == DiscountType.PERCENTAGE) {
            discount = orderSubtotal.multiply(discountValue)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
                discount = maxDiscountAmount;
            }
        } else {
            discount = discountValue;
        }

        // Never let discount exceed order subtotal
        return discount.min(orderSubtotal).setScale(2, RoundingMode.HALF_UP);
    }

    public void incrementTimesUsed() {
        this.timesUsed++;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) {
        this.code = code != null ? code.toUpperCase().trim() : null;
    }

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

    public Store getStore() { return store; }
    public void setStore(Store store) { this.store = store; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
