import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CouponSection from '../components/CouponSection';

/* ── Printable Bill Component ── */
function PrintBillModal({ items, subtotal, discountAmount = 0, appliedCoupon = null, totalAmount, storeName, onClose }) {
  const printDate = new Date().toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const billRef = React.useRef();

  const handlePrint = () => {
    const printContent = billRef.current.innerHTML;
    const w = window.open('', '', 'width=700,height=900');
    w.document.write(`
      <html><head><title>ApnaMart Bill</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 32px; color: #111; max-width: 600px; margin: 0 auto; }
        h2 { text-align: center; font-size: 1.5rem; margin: 0 0 4px; letter-spacing: 2px; }
        .subtitle { text-align: center; font-size: 0.8rem; color: #555; margin-bottom: 16px; }
        .dashed { border-top: 2px dashed #999; margin: 12px 0; }
        .solid { border-top: 2px solid #111; margin: 12px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th { text-align: left; padding: 4px 0; border-bottom: 1px solid #ccc; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 5px 0; vertical-align: top; }
        td:last-child { text-align: right; }
        .total-row td { font-weight: 700; font-size: 1rem; padding-top: 8px; }
        .footer { text-align: center; font-size: 0.75rem; color: #888; margin-top: 20px; }
        .grand-total { font-size: 1.2rem; font-weight: 900; text-align: center; padding: 12px 0; border: 2px solid #111; margin: 12px 0; letter-spacing: 0.05em; }
      </style></head><body>${printContent}</body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.35)'
      }}>
        {/* Modal Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1E293B' }}><i className="bi bi-receipt me-2 text-success"></i>Pre-Order Bill</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.3rem', color: '#94A3B8', cursor: 'pointer' }}><i className="bi bi-x"></i></button>
        </div>

        {/* Bill Preview */}
        <div ref={billRef} style={{ padding: '2rem', fontFamily: 'Courier New, monospace', fontSize: '0.88rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 4px', letterSpacing: 2 }}>APNAMART</h2>
          <div className="subtitle" style={{ textAlign: 'center', fontSize: '0.78rem', color: '#555', marginBottom: 16 }}>Hyperlocal Kirana Pre-Ordering Platform</div>
          <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>{storeName}</div>
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#666', marginBottom: 16 }}>PRE-ORDER RECEIPT</div>
          <div className="dashed" style={{ borderTop: '2px dashed #999', margin: '12px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#555', marginBottom: 4 }}>
            <span>Date: {printDate}</span>
            <span>Items: {itemCount}</span>
          </div>
          <div className="dashed" style={{ borderTop: '2px dashed #999', margin: '12px 0' }}></div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '4px 0', borderBottom: '1px solid #ccc', fontSize: '0.72rem', textTransform: 'uppercase' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '4px 0', borderBottom: '1px solid #ccc', fontSize: '0.72rem', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '4px 0', borderBottom: '1px solid #ccc', fontSize: '0.72rem', textTransform: 'uppercase' }}>Rate</th>
                <th style={{ textAlign: 'right', padding: '4px 0', borderBottom: '1px solid #ccc', fontSize: '0.72rem', textTransform: 'uppercase' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: '5px 0 5px 0', verticalAlign: 'top', maxWidth: 200 }}>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>/{item.unit}</div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '5px 4px', verticalAlign: 'top' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '5px 0', verticalAlign: 'top' }}>Rs.{item.price}</td>
                  <td style={{ textAlign: 'right', padding: '5px 0', verticalAlign: 'top', fontWeight: 600 }}>Rs.{item.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: '2px dashed #999', margin: '12px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
            <span>Subtotal ({itemCount} items)</span><span>Rs.{subtotal}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4, color: '#15803d', fontWeight: 700 }}>
              <span>Coupon Discount ({appliedCoupon?.code})</span><span>-Rs.{discountAmount}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4, color: '#15803d' }}>
            <span>Delivery</span><span>FREE PICKUP</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4, color: '#15803d' }}>
            <span>Tax (GST)</span><span>Rs.0.00</span>
          </div>
          <div style={{ borderTop: '2px solid #111', margin: '12px 0' }}></div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, textAlign: 'center', padding: '10px 0', border: '2px solid #111', margin: '8px 0', letterSpacing: '0.05em' }}>
            TOTAL: Rs.{totalAmount}
          </div>
          <div style={{ borderTop: '2px dashed #999', margin: '12px 0' }}></div>
          <div style={{ fontSize: '0.72rem', color: '#888', textAlign: 'center' }}>Payment: Cash on Pickup</div>
          <div style={{ fontSize: '0.72rem', color: '#888', textAlign: 'center', marginTop: 4 }}>Pre-order — collect at selected time slot</div>
          <div style={{ fontSize: '0.72rem', color: '#888', textAlign: 'center', marginTop: 16 }}>Thank you for supporting local stores!</div>
          <div style={{ fontSize: '0.72rem', color: '#888', textAlign: 'center' }}>www.apnamart.in</div>
        </div>

        {/* Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn-apnamart-primary btn flex-grow-1 fw-bold py-2" style={{ borderRadius: 12 }}>
            <i className="bi bi-printer me-2"></i>Print Bill
          </button>
          <button onClick={onClose} className="btn btn-outline-secondary flex-grow-1 rounded-pill py-2" style={{ fontWeight: 600 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, loading, subtotal, totalAmount, discountAmount, finalPayable, appliedCoupon, updateQuantity, removeItem, storeName, storeId } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showBill, setShowBill] = useState(false);

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="premium-card text-center animate-fade-in" style={{ maxWidth: 460, width: '100%', padding: '3rem 2rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', fontSize: '2.2rem', color: '#15803d'
          }}>
            <i className="bi bi-cart3"></i>
          </div>
          <h4 style={{ fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>Sign In to View Cart</h4>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            You need to log in to view your pre-order cart and reserve grocery pickup slots.
          </p>
          <Link to="/login" className="btn-apnamart-primary btn px-5 py-2" id="cart-login-btn">
            <i className="bi bi-box-arrow-in-right me-2"></i>Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
          <p style={{ color: '#64748B', fontWeight: 500 }}>Loading your cart...</p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="container py-4 animate-fade-in">
      {showBill && (
        <PrintBillModal
          items={items}
          subtotal={subtotal}
          discountAmount={discountAmount}
          appliedCoupon={appliedCoupon}
          totalAmount={finalPayable}
          storeName={storeName}
          onClose={() => setShowBill(false)}
        />
      )}

      {/* Page Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, #1B4D3E, #0f7f56)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '1.3rem'
        }}>
          <i className="bi bi-cart3"></i>
        </div>
        <div>
          <h1 style={{ fontWeight: 800, color: '#1E293B', margin: 0, fontSize: '1.5rem' }}>Your Cart</h1>
          {storeName && (
            <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '0.15rem 0 0' }}>
              <i className="bi bi-shop me-1 text-success"></i>
              Shopping from <strong style={{ color: '#1E293B' }}>{storeName}</strong>
              <Link to="/stores" style={{ color: '#1B4D3E', textDecoration: 'none', fontWeight: 600, marginLeft: '0.75rem' }}>
                Change Store
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Single-store notice */}
      {storeName && items.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #eff6ff, #dbeafe)',
          border: '1px solid #bfdbfe', borderRadius: 12,
          padding: '0.75rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem',
          fontSize: '0.82rem', color: '#1e40af', fontWeight: 500, marginBottom: '1.25rem'
        }}>
          <i className="bi bi-info-circle-fill"></i>
          ApnaMart supports pre-ordering from one store at a time. To add from another store, clear this cart first.
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-basket" style={{ fontSize: '3.5rem', color: '#CBD5E1', display: 'block', marginBottom: '1rem' }}></i>
          <h4 style={{ fontWeight: 800, color: '#475569', marginBottom: '0.5rem' }}>Your cart is empty</h4>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', maxWidth: 360, margin: '0 auto 1.5rem' }}>
            Looking for an order you just placed? Or ready to browse essentials from your neighborhood kirana?
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/stores" className="btn-apnamart-primary btn px-4 py-2" id="browse-stores-btn">
              <i className="bi bi-shop-window me-2"></i>Browse Stores
            </Link>
            <Link to="/customer/orders" className="btn btn-outline-success rounded-pill px-4 py-2 fw-semibold" id="view-orders-from-cart-btn">
              <i className="bi bi-bag-check me-2"></i>View My Orders &amp; Bills
            </Link>
          </div>

          {/* Helpful callout box */}
          <div style={{
            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
            border: '1px solid #BBF7D0', borderRadius: 16,
            padding: '1.25rem 1.5rem', maxWidth: 480, margin: '2rem auto 0',
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.9rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="bi bi-receipt-cutoff fs-5"></i>
              Placed an order recently?
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.75rem' }}>
              Your cart empties automatically once your order is confirmed. Your order history, live packing status, and downloadable receipts are always available in <strong>My Orders</strong>.
            </p>
            <Link to="/customer/orders" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', textDecoration: 'none' }}>
              Track order status or print bill &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Items Table */}
          <div className="col-lg-8">
            {/* Edit notice */}
            <div style={{
              background: 'linear-gradient(90deg, #f0fdf4, #dcfce7)',
              border: '1px solid #bbf7d0', borderRadius: 12,
              padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem',
              fontSize: '0.8rem', color: '#15803d', fontWeight: 500, marginBottom: '0.75rem'
            }}>
              <i className="bi bi-pencil-square"></i>
              <span>You can <strong>edit quantities or remove items</strong> any time until your order is packed by the shopkeeper.</span>
            </div>
            <div className="premium-card">
              <div className="premium-card-header">
                <span className="premium-card-title">
                  <i className="bi bi-bag me-2 text-success"></i>
                  Order Items ({itemCount} items)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>From: {storeName}</span>
                  <button onClick={() => setShowBill(true)} className="btn btn-outline-success btn-sm rounded-pill px-3" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <i className="bi bi-receipt"></i> View Bill
                  </button>
                </div>
              </div>
              <div style={{ padding: '0.5rem' }}>
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem',
                      borderBottom: idx < items.length - 1 ? '1px solid #F1F5F9' : 'none',
                      transition: 'background 0.15s',
                      borderRadius: 10,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Image */}
                    <div style={{
                      width: 66, height: 66, borderRadius: 12,
                      background: '#F8FAFC', border: '1px solid #F1F5F9',
                      overflow: 'hidden', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'}
                        alt={item.productName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.925rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>₹{item.price}/{item.unit}</div>
                    </div>

                    {/* Qty Control */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center',
                      border: '1.5px solid #E2E8F0', borderRadius: 999, background: '#fff',
                      overflow: 'hidden'
                    }}>
                      <button
                        type="button"
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1.1rem' }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{item.quantity}</span>
                      <button
                        type="button"
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1.1rem' }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.availableQuantity}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    {/* Line Total */}
                    <div style={{ fontWeight: 800, color: '#1B4D3E', fontSize: '1rem', minWidth: 60, textAlign: 'right' }}>
                      ₹{item.lineTotal}
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      style={{
                        background: '#FFF1F2', border: 'none', borderRadius: 8,
                        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#F43F5E', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                      }}
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                      onMouseEnter={e => e.currentTarget.style.background = '#FFE4E8'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFF1F2'}
                    >
                      <i className="bi bi-trash" style={{ fontSize: '0.9rem' }}></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, padding: '1.5rem', position: 'sticky', top: 90, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h5 style={{ fontWeight: 800, color: '#1E293B', marginBottom: '1.25rem', fontSize: '1rem' }}>
                <i className="bi bi-receipt me-2 text-success"></i>Order Summary
              </h5>

              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.875rem' }}>
                <span style={{ color: '#64748B' }}>Subtotal ({itemCount} items)</span>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 align-items-center" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: '#059669', fontWeight: 600 }}>
                    <i className="bi bi-tag-fill me-1"></i>Coupon ({appliedCoupon?.code})
                  </span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>-₹{discountAmount}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.875rem' }}>
                <span style={{ color: '#64748B' }}>Delivery Charge</span>
                <span style={{ color: '#15803d', fontWeight: 600 }}>Free Pickup</span>
              </div>
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.875rem' }}>
                <span style={{ color: '#64748B' }}>Estimated Tax</span>
                <span style={{ color: '#15803d', fontWeight: 600 }}>₹0</span>
              </div>

              {/* Coupon Section Widget */}
              <div className="my-3">
                <CouponSection storeId={storeId} subtotal={subtotal} />
              </div>

              <hr style={{ borderColor: '#F1F5F9', margin: '0.75rem 0' }} />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '1rem' }}>Total Amount</span>
                <div className="text-end">
                  {discountAmount > 0 && (
                    <div style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '0.85rem' }}>
                      ₹{totalAmount}
                    </div>
                  )}
                  <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#1B4D3E' }}>₹{finalPayable}</span>
                </div>
              </div>

              {/* Slot info */}
              <div style={{
                background: 'linear-gradient(135deg, #EBF5F0, #dcfce7)',
                border: '1px solid #bbf7d0', borderRadius: 12,
                padding: '0.75rem', marginBottom: '1rem',
                fontSize: '0.78rem', color: '#15803d'
              }}>
                <i className="bi bi-alarm-fill me-2"></i>
                <strong>Next Step:</strong> Select a convenient pickup time slot at checkout
              </div>

              <button
                className="btn-apnamart-primary btn w-100 py-2 mb-2 fw-bold"
                style={{ borderRadius: 14, fontSize: '0.95rem' }}
                onClick={() => navigate('/checkout')}
                id="proceed-checkout-btn"
              >
                <i className="bi bi-arrow-right-circle me-2"></i>Proceed to Checkout
              </button>

              <button
                className="btn btn-outline-success w-100 py-2 mb-2 rounded-pill fw-semibold"
                style={{ fontSize: '0.875rem' }}
                onClick={() => setShowBill(true)}
                id="print-bill-btn"
              >
                <i className="bi bi-printer me-2"></i>Print / View Bill
              </button>

              <Link
                to={storeId ? `/stores/${storeId}` : '/stores'}
                className="btn btn-outline-secondary w-100 py-2 rounded-pill text-decoration-none small fw-semibold"
              >
                <i className="bi bi-arrow-left me-2"></i>Continue Shopping
              </Link>

              {/* Secure checkout */}
              <div className="text-center mt-3" style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                <i className="bi bi-shield-check me-1 text-success"></i>
                Secure checkout • Zero hidden fees
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
