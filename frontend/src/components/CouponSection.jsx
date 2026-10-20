import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { couponApi } from '../api';

export default function CouponSection({ storeId, subtotal }) {
  const { appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCart();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAvailableModal, setShowAvailableModal] = useState(false);

  useEffect(() => {
    if (storeId) {
      couponApi.getAvailableCoupons({ storeId })
        .then((res) => {
          if (res.data) {
            setAvailableCoupons(res.data);
          }
        })
        .catch((err) => console.error('Error fetching available coupons:', err));
    }
  }, [storeId]);

  const handleApply = async (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setErrorMsg('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const data = await applyCoupon(code);
      setSuccessMsg(data.message || `Promo code ${code} applied!`);
      setCouponCodeInput('');
      setShowAvailableModal(false);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <div className="coupon-section mb-3">
      {/* If coupon is already applied */}
      {appliedCoupon ? (
        <div style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1.5px dashed #059669',
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)'
        }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#059669',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}>
              <i className="bi bi-tag-fill"></i>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontWeight: 800, color: '#065F46', letterSpacing: '0.05em', fontSize: '0.9rem' }}>
                  {appliedCoupon.code}
                </span>
                <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>APPLIED</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
                You save ₹{discountAmount} with this code! 🎉
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              background: 'none',
              border: 'none',
              color: '#DC2626',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
            title="Remove Coupon"
          >
            <i className="bi bi-x-circle me-1"></i>Remove
          </button>
        </div>
      ) : (
        /* Coupon Input Box */
        <div>
          <div className="d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderRadius: '12px 0 0 12px' }}>
                <i className="bi bi-ticket-perforated"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter Promo Code"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                style={{ borderRadius: '0 12px 12px 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}
                disabled={loading}
              />
            </div>
            <button
              type="button"
              className="btn btn-dark fw-bold px-3"
              style={{ borderRadius: 12, minWidth: 80, fontSize: '0.875rem' }}
              onClick={() => handleApply()}
              disabled={loading || !couponCodeInput.trim()}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mt-2 text-danger small d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
              <i className="bi bi-exclamation-circle-fill"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-2 text-success small d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
              <i className="bi bi-check-circle-fill"></i>
              <span>{successMsg}</span>
            </div>
          )}

          {/* View Available Coupons Trigger */}
          {availableCoupons.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-success fw-bold d-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
                onClick={() => setShowAvailableModal(true)}
              >
                <i className="bi bi-stars"></i>
                <span>View {availableCoupons.length} Available Coupons & Offers</span>
                <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }}></i>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Available Coupons Modal / Drawer */}
      {showAvailableModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 10500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 500,
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC'
            }}>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-gift-fill text-success fs-5"></i>
                <div>
                  <h6 className="m-0 fw-bold text-dark">Available Offers & Deals</h6>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Select a promo code to apply to your order</small>
                </div>
              </div>
              <button
                onClick={() => setShowAvailableModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#94A3B8', cursor: 'pointer' }}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            {/* List */}
            <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {availableCoupons.map((coupon) => {
                const meetsMinOrder = !coupon.minOrderAmount || (subtotal >= coupon.minOrderAmount);
                const shortAmount = coupon.minOrderAmount ? (coupon.minOrderAmount - (subtotal || 0)) : 0;

                return (
                  <div
                    key={coupon.id}
                    style={{
                      border: '1.5px solid #E2E8F0',
                      borderRadius: 14,
                      padding: 14,
                      background: meetsMinOrder ? '#FFFFFF' : '#F8FAFC',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{
                          border: '1.5px dashed #059669',
                          background: '#ECFDF5',
                          color: '#065F46',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '3px 8px',
                          borderRadius: 6,
                          letterSpacing: '0.05em'
                        }}>
                          {coupon.code}
                        </span>
                        {coupon.badge && (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 999,
                            background: coupon.badge.includes('FLASH') ? '#FEF2F2' : '#EFF6FF',
                            color: coupon.badge.includes('FLASH') ? '#DC2626' : '#2563EB',
                            border: `1px solid ${coupon.badge.includes('FLASH') ? '#FECACA' : '#BFDBFE'}`
                          }}>
                            {coupon.badge}
                          </span>
                        )}
                      </div>

                      {/* Apply button */}
                      <button
                        type="button"
                        className="btn btn-sm btn-success fw-bold px-3"
                        style={{ borderRadius: 999, fontSize: '0.78rem' }}
                        onClick={() => handleApply(coupon.code)}
                        disabled={loading || !meetsMinOrder}
                      >
                        {meetsMinOrder ? 'Apply' : 'Locked'}
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: 2 }}>
                      {coupon.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: 6 }}>
                      {coupon.description}
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ fontSize: '0.72rem' }}>
                      <span className="text-muted">
                        {coupon.minOrderAmount > 0 ? `Min. Cart: ₹${coupon.minOrderAmount}` : 'No Min Order'}
                      </span>
                      {coupon.timeRemainingFormatted && (
                        <span style={{ color: '#D97706', fontWeight: 600 }}>
                          <i className="bi bi-clock me-1"></i>{coupon.timeRemainingFormatted}
                        </span>
                      )}
                    </div>

                    {!meetsMinOrder && (
                      <div className="mt-2 py-1 px-2 rounded-2" style={{ background: '#FFFBEB', color: '#B45309', fontSize: '0.72rem', fontWeight: 600 }}>
                        <i className="bi bi-info-circle me-1"></i>
                        Add ₹{shortAmount.toFixed(2)} more items to unlock this offer
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-4 rounded-pill fw-semibold"
                onClick={() => setShowAvailableModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
