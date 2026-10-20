import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderApi } from '../api';
import OrderTrackingModal from '../components/OrderTrackingModal';
import OrderBillModal from '../components/OrderBillModal';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [showTracking, setShowTracking] = useState(false);
  const [showBill, setShowBill] = useState(false);

  useEffect(() => {
    if (!order && orderNumber) {
      orderApi.getMyOrders()
        .then((res) => {
          if (res.data) {
            const found = res.data.find((o) => o.orderNumber === orderNumber);
            if (found) setOrder(found);
          }
        })
        .catch((err) => console.error('Error fetching confirmed order:', err))
        .finally(() => setLoading(false));
    }
  }, [order, orderNumber]);

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div className="spinner-border text-success mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status"></div>
        <p style={{ color: '#64748B', fontWeight: 500 }}>Fetching your order confirmation...</p>
      </div>
    );
  }

  const INFO_ROWS = [
    {
      icon: 'bi-calendar-event',
      iconBg: '#dcfce7', iconColor: '#15803d',
      label: 'Pickup Date & Time',
      value: order ? `${order.pickupDate} • ${order.pickupTime}` : '—',
    },
    {
      icon: 'bi-shop',
      iconBg: '#dbeafe', iconColor: '#1e40af',
      label: 'Store',
      value: order?.storeName || '—',
      sub: order?.storeAddress,
    },
    {
      icon: 'bi-wallet2',
      iconBg: '#fef3c7', iconColor: '#92400e',
      label: 'Payment Method',
      value: order?.paymentMethod === 'CASH_ON_PICKUP' ? 'Cash on Pickup' : 'Pay at Store',
      badge: 'Pay on Collection',
    },
    {
      icon: 'bi-box-seam',
      iconBg: '#f3e8ff', iconColor: '#7e22ce',
      label: 'Order Status',
      value: 'Pending — Awaiting Shopkeeper Confirmation',
    },
  ];

  return (
    <div className="container py-5 animate-fade-in" style={{ maxWidth: 680 }}>
      {/* Header Card */}
      <div className="confirmation-header">
        {/* Background decoration */}
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', top: -100, right: -80, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', bottom: -60, left: 60, pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="confirmation-check">
            <i className="bi bi-check-lg"></i>
          </div>
          <h1 style={{ fontWeight: 900, color: '#fff', fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            Order Confirmed! 🎉
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Your pre-order has been placed successfully. The kirana store is preparing your order.
          </p>
          <div className="confirmation-order-num">
            #{order?.orderNumber || orderNumber}
          </div>
        </div>
      </div>

      {/* Coupon Savings Banner */}
      {order?.discountAmount > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1.5px solid #A7F3D0',
          borderRadius: 16,
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(5,150,105,0.1)'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#059669', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', flexShrink: 0
          }}>
            <i className="bi bi-tag-fill"></i>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#065F46', fontSize: '1rem' }}>
              You saved ₹{order.discountAmount} on this order! 🎉
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857' }}>
              Promo code <strong>{order.couponCode}</strong> was successfully applied to your kirana pre-order.
            </div>
          </div>
        </div>
      )}

      {/* Order Info Card */}
      <div className="premium-card mb-4">
        <div className="premium-card-header">
          <span className="premium-card-title">
            <i className="bi bi-receipt me-2 text-success"></i>Order Details
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div style={{ padding: '0.5rem' }}>
          {INFO_ROWS.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                padding: '1rem 1.25rem',
                borderBottom: i < INFO_ROWS.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: row.iconBg, color: row.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.15rem'
              }}>
                <i className={`bi ${row.icon}`}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                  {row.label}
                </div>
                <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>
                  {row.value}
                  {row.badge && (
                    <span style={{ marginLeft: '0.5rem', background: '#fef3c7', color: '#92400e', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                      {row.badge}
                    </span>
                  )}
                </div>
                {row.sub && <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.15rem' }}>{row.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Order Goods Card */}
      {order?.items?.length > 0 && (
        <div className="premium-card mb-4">
          <div className="premium-card-header d-flex justify-content-between align-items-center">
            <span className="premium-card-title">
              <i className="bi bi-basket3 me-2 text-success"></i>Items Ordered ({order.items.length})
            </span>
            <span style={{ fontWeight: 800, color: '#1B4D3E', fontSize: '1.05rem' }}>
              Total Paid: ₹{order.totalAmount}
            </span>
          </div>
          <div className="table-responsive p-3">
            <table className="table align-middle mb-0" style={{ fontSize: '0.875rem' }}>
              <thead className="table-light">
                <tr style={{ color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th>Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Rate</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, idx) => (
                  <tr key={it.id || idx}>
                    <td style={{ fontWeight: 600, color: '#1E293B' }}>{it.productName}</td>
                    <td className="text-center fw-bold">{it.quantity}</td>
                    <td className="text-end text-muted">₹{it.unitPrice}</td>
                    <td className="text-end fw-bold" style={{ color: '#1B4D3E' }}>₹{it.lineTotal}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light">
                {order.discountAmount > 0 && (
                  <>
                    <tr>
                      <td colSpan="3" className="text-end text-muted">Subtotal:</td>
                      <td className="text-end fw-semibold text-dark">₹{order.subtotal}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end text-success fw-semibold">
                        <i className="bi bi-tag-fill me-1"></i>Coupon Discount ({order.couponCode}):
                      </td>
                      <td className="text-end fw-bold text-success">-₹{order.discountAmount}</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Total Amount Payable:</td>
                  <td className="text-end fw-bold text-success fs-6">₹{order.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-flex flex-column gap-2 mb-4">
        {order && (
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <button
                type="button"
                className="btn fw-bold py-2 w-100 d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #1B4D3E, #0f7f56)',
                  color: '#fff', border: 'none', borderRadius: 14, fontSize: '0.925rem',
                  boxShadow: '0 4px 14px rgba(27,77,62,0.3)',
                }}
                onClick={() => setShowTracking(true)}
                id="track-order-btn"
              >
                <span className="pulsing-live-dot"></span>
                <i className="bi bi-geo-alt-fill"></i>
                Track Live Order Status
              </button>
            </div>
            <div className="col-12 col-md-6">
              <button
                type="button"
                className="btn btn-outline-success fw-bold py-2 w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: 14, fontSize: '0.925rem', border: '2px solid #1B4D3E', color: '#1B4D3E' }}
                onClick={() => setShowBill(true)}
                id="view-confirmation-bill-btn"
              >
                <i className="bi bi-printer"></i>
                Print / Download Bill
              </button>
            </div>
          </div>
        )}

        <div className="d-flex gap-2 mt-2">
          <Link
            to="/customer/orders"
            className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold flex-grow-1"
            style={{ fontSize: '0.875rem' }}
            id="view-my-orders-btn"
          >
            <i className="bi bi-bag-check me-2"></i>View My Orders
          </Link>
          <Link
            to="/stores"
            className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold flex-grow-1"
            style={{ fontSize: '0.875rem' }}
          >
            <i className="bi bi-shop me-2"></i>Shop More
          </Link>
        </div>
      </div>

      {/* Trust Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #EBF5F0, #dcfce7)',
        border: '1px solid #bbf7d0', borderRadius: 16, padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <div style={{ fontSize: '2rem' }}>🌱</div>
        <div>
          <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
            Thank you for supporting local stores!
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Your order helps neighbourhood kirana stores thrive. Collect your packed order at the chosen slot — no queue!
          </div>
        </div>
      </div>

      {/* Live Tracking Modal */}
      {showTracking && order && (
        <OrderTrackingModal
          order={order}
          onClose={() => setShowTracking(false)}
          onOrderUpdated={(updated) => setOrder(updated)}
        />
      )}

      {/* Printable / Downloadable Bill Modal */}
      {showBill && order && (
        <OrderBillModal
          order={order}
          onClose={() => setShowBill(false)}
        />
      )}
    </div>
  );
}
