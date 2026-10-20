package com.apnamart.service;

import com.apnamart.dto.request.CouponRequest;
import com.apnamart.dto.response.CouponResponse;
import com.apnamart.dto.response.CouponValidateResponse;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {

    CouponValidateResponse validateCoupon(String code, Long storeId, BigDecimal subtotal);

    List<CouponResponse> getAvailableCoupons(Long storeId, BigDecimal subtotal);

    List<CouponResponse> getAllCoupons();

    List<CouponResponse> getStoreCoupons(Long storeId);

    CouponResponse getCouponById(Long id);

    CouponResponse createCoupon(CouponRequest request, String creatorEmail);

    CouponResponse updateCoupon(Long id, CouponRequest request, String updaterEmail);

    CouponResponse toggleCouponStatus(Long id, String updaterEmail);

    void deleteCoupon(Long id, String deleterEmail);
}
