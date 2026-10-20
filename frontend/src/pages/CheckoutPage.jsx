import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { storeApi, orderApi } from '../api';
import CouponSection from '../components/CouponSection';

export default function CheckoutPage() {
  const { cart, totalAmount, subtotal, discountAmount, finalPayable, appliedCoupon, storeId, storeName, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(2); // Step 2: Pickup Slot (Step 1 was Cart)
  const [store, setStore] = useState(null);
  const [allSlots, setAllSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_PICKUP');
  const [customerNote, setCustomerNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const items = cart?.items || [];

  useEffect(() => {
    if (!storeId || items.length === 0) {
      navigate('/cart');
      return;
    }

    setLoading(true);
    Promise.all([
      storeApi.getStoreById(storeId),
      storeApi.getStorePickupSlots(storeId)
    ])
      .then(([storeRes, slotsRes]) => {
        if (storeRes.data) setStore(storeRes.data);
        if (slotsRes.data) {
          setAllSlots(slotsRes.data);
          if (slotsRes.data.length > 0) {
            const firstDate = slotsRes.data[0].pickupDate;
            setSelectedDate(firstDate);
            setSelectedSlot(slotsRes.data[0]);
          }
        }
      })
      .catch((err) => console.error('Error loading checkout data:', err))
      .finally(() => setLoading(false));
  }, [storeId, items.length]);

  // Group slots by unique date
  const uniqueDates = Array.from(new Set(allSlots.map((s) => s.pickupDate)));
  const slotsForSelectedDate = allSlots.filter((s) => s.pickupDate === selectedDate);

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return { title: 'Today', sub: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return { title: 'Tomorrow', sub: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    }
    return {
      title: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sub: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const handleConfirmOrder = async () => {
    if (!selectedSlot) {
      setErrorMsg('Please select a pickup time slot');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const res = await orderApi.placeOrder({
        pickupSlotId: selectedSlot.id,
        paymentMethod,
        customerNote: customerNote.trim() || null,
        couponCode: appliedCoupon?.code || null,
      });

      if (res && res.data) {
        // Clear customer cart state
        await clearCart();
        navigate(`/order-confirmation/${res.data.orderNumber}`, { state: { order: res.data } });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      {/* 4-Step Stepper matching Screen 4 */}
      <div className="checkout-stepper my-3">
        <div className="stepper-step completed">
          <div className="stepper-circle"><i className="bi bi-check"></i></div>
          <span>Cart</span>
        </div>
        <div className="stepper-line active"></div>

        <div className={`stepper-step ${step >= 2 ? 'active' : ''}`}>
          <div className="stepper-circle">2</div>
          <span>Pickup Slot</span>
        </div>
        <div className={`stepper-line ${step >= 3 ? 'active' : ''}`}></div>

        <div className={`stepper-step ${step >= 3 ? 'active' : ''}`}>
          <div className="stepper-circle">3</div>
          <span>Review</span>
        </div>
        <div className={`stepper-line ${step === 4 ? 'active' : ''}`}></div>

        <div className="stepper-step">
          <div className="stepper-circle">4</div>
          <span>Confirm</span>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm py-2 px-3 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading store schedule & slots...</p>
        </div>
      ) : step === 2 ? (
        /* Step 2: Slot Selection matching Screen 4 */
        <div>
          <h3 className="fw-bold text-dark mb-3">Select Pickup Slot</h3>

          {/* Store Info Card */}
          {store && (
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white d-flex flex-row align-items-center gap-3">
              <img
                src={store.imageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'}
                alt={store.storeName}
                style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                className="rounded-3"
              />
              <div>
                <h5 className="fw-bold text-dark m-0">{store.storeName}</h5>
                <p className="text-muted small m-0">{store.address}, {store.locality}, {store.city}</p>
              </div>
            </div>
          )}

          {/* Date Selection Pills */}
          <h6 className="fw-bold text-dark mb-2">Select Date</h6>
          <div className="d-flex gap-3 mb-4 flex-wrap">
            {uniqueDates.map((dateStr) => {
              const { title, sub } = formatDateLabel(dateStr);
              const isSelected = selectedDate === dateStr;
              return (
                <div
                  key={dateStr}
                  className={`date-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    const slotsOnDate = allSlots.filter((s) => s.pickupDate === dateStr);
                    if (slotsOnDate.length > 0) setSelectedSlot(slotsOnDate[0]);
                  }}
                >
                  <div className="small fw-semibold">{title}</div>
                  <div className="fs-6">{sub}</div>
                </div>
              );
            })}
          </div>

          {/* Time Slot Cards Grid */}
          <h6 className="fw-bold text-dark mb-2">Available Time Slots</h6>
          {slotsForSelectedDate.length === 0 ? (
            <div className="alert alert-light border rounded-3 text-muted small p-4 text-center">
              No pickup slots available for this date. Please select another date.
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mb-4">
              {slotsForSelectedDate.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <div className="col" key={slot.id}>
                    <div
                      className={`time-slot-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div>
                        <div className="text-dark small">
                          {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                        </div>
                        <span className="slot-spots-badge mt-1 d-inline-block">
                          ({slot.availableSpots} spots left)
                        </span>
                      </div>
                      {isSelected && <i className="bi bi-check-circle-fill text-success fs-5"></i>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between pt-3 border-top">
            <Link to="/cart" className="btn btn-outline-secondary rounded-pill px-4">
              Back
            </Link>
            <button
              type="button"
              className="btn btn-apnamart-primary rounded-pill px-4"
              disabled={!selectedSlot}
              onClick={() => setStep(3)}
            >
              Next: Review Order
            </button>
          </div>
        </div>
      ) : (
        /* Step 3: Review Order before Confirmation */
        <div>
          <h3 className="fw-bold text-dark mb-3">Review Your Pre-Order</h3>

          <div className="row g-4 mb-4">
            <div className="col-md-7">
              {/* Pickup Schedule Summary */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white">
                <h6 className="fw-bold text-dark mb-3">
                  <i className="bi bi-clock-fill text-success me-2"></i> Pickup Details
                </h6>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Store:</span>
                  <span className="fw-bold text-dark">{store?.storeName}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Date:</span>
                  <span className="fw-bold text-dark">{selectedSlot?.pickupDate}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Time Slot:</span>
                  <span className="fw-bold text-dark">
                    {selectedSlot?.startTime?.substring(0, 5)} - {selectedSlot?.endTime?.substring(0, 5)}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Address:</span>
                  <span className="text-end small text-dark" style={{ maxWidth: '280px' }}>
                    {store?.address}, {store?.locality}, {store?.city}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white">
                <h6 className="fw-bold text-dark mb-3">
                  <i className="bi bi-cash-stack text-success me-2"></i> Payment Method
                </h6>
                <div className="form-check p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                  <input
                    className="form-check-input ms-0"
                    type="radio"
                    name="payMethod"
                    id="cashOnPickup"
                    checked={paymentMethod === 'CASH_ON_PICKUP'}
                    onChange={() => setPaymentMethod('CASH_ON_PICKUP')}
                  />
                  <label className="form-check-label text-dark fw-semibold" htmlFor="cashOnPickup">
                    Pay at Store on Pickup (Cash / UPI at Store Counter)
                  </label>
                </div>
              </div>

              {/* Customer Note */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-card-text text-success me-2"></i> Special Instructions (Optional)
                </h6>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Please pack green vegetables in cloth bag, or call upon packing"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Items Summary Column */}
            <div className="col-md-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h6 className="fw-bold text-dark mb-3">Order Items ({items.length})</h6>
                <div className="list-group list-group-flush mb-3">
                  {items.map((item) => (
                    <div key={item.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold text-dark small">{item.productName}</div>
                        <small className="text-muted">{item.quantity} x ₹{item.price}</small>
                      </div>
                      <span className="fw-bold text-dark small">₹{item.lineTotal}</span>
                    </div>
                  ))}
                </div>

                <hr className="my-2" />
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-semibold text-dark">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between py-1 align-items-center">
                    <span className="text-success fw-semibold">
                      <i className="bi bi-tag-fill me-1"></i>Coupon ({appliedCoupon?.code})
                    </span>
                    <span className="text-success fw-bold">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Estimated Tax</span>
                  <span className="text-success fw-semibold">₹0</span>
                </div>

                {/* Coupon Selection Widget inside Checkout */}
                <div className="my-3">
                  <CouponSection storeId={storeId} subtotal={subtotal} />
                </div>

                <div className="d-flex justify-content-between py-2 border-top mt-2">
                  <span className="fw-bold text-dark fs-5">Total</span>
                  <div className="text-end">
                    {discountAmount > 0 && (
                      <div style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '0.85rem' }}>
                        ₹{totalAmount}
                      </div>
                    )}
                    <span className="fw-bold fs-4 text-success">₹{finalPayable}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-apnamart-primary w-100 rounded-pill py-2 mt-3 fw-bold"
                  onClick={handleConfirmOrder}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Reserving Stock...</span>
                  ) : (
                    'Confirm & Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between pt-3 border-top">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setStep(2)}>
              Back to Slot Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
