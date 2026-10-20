package com.apnamart.service.impl;

import com.apnamart.dto.request.CouponRequest;
import com.apnamart.dto.response.CouponResponse;
import com.apnamart.dto.response.CouponValidateResponse;
import com.apnamart.entity.Coupon;
import com.apnamart.entity.Store;
import com.apnamart.entity.User;
import com.apnamart.enums.Role;
import com.apnamart.exception.BadRequestException;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.exception.UnauthorizedException;
import com.apnamart.repository.CouponRepository;
import com.apnamart.repository.StoreRepository;
import com.apnamart.repository.UserRepository;
import com.apnamart.service.CouponService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public CouponServiceImpl(CouponRepository couponRepository,
                             StoreRepository storeRepository,
                             UserRepository userRepository) {
        this.couponRepository = couponRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidateResponse validateCoupon(String code, Long storeId, BigDecimal subtotal) {
        if (code == null || code.trim().isEmpty()) {
            return CouponValidateResponse.invalid("Please enter a valid promo code.");
        }

        String normalizedCode = code.trim().toUpperCase();
        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizedCode)
                .orElse(null);

        if (coupon == null) {
            return CouponValidateResponse.invalid("Invalid promo code '" + normalizedCode + "'. Please check spelling.");
        }

        if (!coupon.isActive()) {
            return CouponValidateResponse.invalid("Coupon '" + normalizedCode + "' is currently deactivated.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            return CouponValidateResponse.invalid("This offer is scheduled to start soon and is not yet active.");
        }

        if (coupon.getEndDate() != null && now.isAfter(coupon.getEndDate())) {
            return CouponValidateResponse.invalid("This limited-time offer has expired.");
        }

        if (coupon.getUsageLimit() != null && coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            return CouponValidateResponse.invalid("This offer has reached its maximum total redemptions.");
        }

        // Store validation if store-specific
        if (coupon.getStore() != null) {
            if (storeId == null || !coupon.getStore().getId().equals(storeId)) {
                return CouponValidateResponse.invalid("This coupon is exclusively valid at " + coupon.getStore().getStoreName());
            }
        }

        BigDecimal orderSubtotal = subtotal != null ? subtotal : BigDecimal.ZERO;
        if (coupon.getMinOrderAmount() != null && orderSubtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponValidateResponse.invalid(
                    "Minimum order of ₹" + coupon.getMinOrderAmount() + " required to use this coupon. Add ₹" +
                    coupon.getMinOrderAmount().subtract(orderSubtotal) + " more items."
            );
        }

        BigDecimal discount = coupon.calculateDiscount(orderSubtotal);
        BigDecimal finalTotal = orderSubtotal.subtract(discount).max(BigDecimal.ZERO);

        return CouponValidateResponse.success(
                "Promo code " + coupon.getCode() + " applied successfully!",
                coupon.getCode(),
                coupon.getTitle(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                discount,
                orderSubtotal,
                finalTotal,
                coupon.getMinOrderAmount(),
                coupon.getBadge(),
                CouponResponse.fromEntity(coupon)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getAvailableCoupons(Long storeId, BigDecimal subtotal) {
        List<Coupon> rawCoupons;
        if (storeId != null) {
            rawCoupons = couponRepository.findAvailableCouponsForStore(storeId);
        } else {
            rawCoupons = couponRepository.findByActiveTrue();
        }

        LocalDateTime now = LocalDateTime.now();
        return rawCoupons.stream()
                .filter(c -> c.isActive() &&
                        (c.getStartDate() == null || !now.isBefore(c.getStartDate())) &&
                        (c.getEndDate() == null || !now.isAfter(c.getEndDate())) &&
                        (c.getUsageLimit() == null || c.getTimesUsed() < c.getUsageLimit()))
                .map(CouponResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(CouponResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getStoreCoupons(Long storeId) {
        return couponRepository.findByStoreId(storeId).stream()
                .map(CouponResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        return CouponResponse.fromEntity(coupon);
    }

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponRequest request, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String code = request.getCode().trim().toUpperCase();
        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new BadRequestException("Coupon code '" + code + "' already exists. Please choose a different code.");
        }

        Store store = null;
        if (creator.getRole() == Role.ROLE_SHOPKEEPER) {
            store = storeRepository.findByOwnerId(creator.getId())
                    .orElseThrow(() -> new BadRequestException("You must have an approved store to create coupons"));
        } else if (creator.getRole() == Role.ROLE_ADMIN) {
            if (request.getStoreId() != null) {
                store = storeRepository.findById(request.getStoreId())
                        .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + request.getStoreId()));
            }
        } else {
            throw new UnauthorizedException("Customers cannot create coupons");
        }

        Coupon coupon = new Coupon(
                code,
                request.getTitle(),
                request.getDescription(),
                request.getDiscountType(),
                request.getDiscountValue(),
                request.getMinOrderAmount(),
                request.getMaxDiscountAmount(),
                request.getStartDate(),
                request.getEndDate(),
                request.getUsageLimit(),
                store,
                request.getBadge()
        );

        if (request.getActive() != null) {
            coupon.setActive(request.getActive());
        }

        Coupon saved = couponRepository.save(coupon);
        return CouponResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(Long id, CouponRequest request, String updaterEmail) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        verifyCouponOwnershipOrAdmin(coupon, updaterEmail);

        if (request.getCode() != null) {
            String newCode = request.getCode().trim().toUpperCase();
            if (!newCode.equalsIgnoreCase(coupon.getCode()) && couponRepository.existsByCodeIgnoreCase(newCode)) {
                throw new BadRequestException("Coupon code '" + newCode + "' is already in use.");
            }
            coupon.setCode(newCode);
        }

        coupon.setTitle(request.getTitle());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderAmount(request.getMinOrderAmount() != null ? request.getMinOrderAmount() : BigDecimal.ZERO);
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setBadge(request.getBadge());
        if (request.getActive() != null) {
            coupon.setActive(request.getActive());
        }

        return CouponResponse.fromEntity(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public CouponResponse toggleCouponStatus(Long id, String updaterEmail) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        verifyCouponOwnershipOrAdmin(coupon, updaterEmail);

        coupon.setActive(!coupon.isActive());
        return CouponResponse.fromEntity(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id, String deleterEmail) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        verifyCouponOwnershipOrAdmin(coupon, deleterEmail);

        couponRepository.delete(coupon);
    }

    private void verifyCouponOwnershipOrAdmin(Coupon coupon, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ROLE_ADMIN) {
            return;
        }

        if (user.getRole() == Role.ROLE_SHOPKEEPER) {
            if (coupon.getStore() == null || !coupon.getStore().getOwner().getId().equals(user.getId())) {
                throw new UnauthorizedException("You are not authorized to modify this coupon");
            }
            return;
        }

        throw new UnauthorizedException("You do not have permission to manage coupons");
    }
}
