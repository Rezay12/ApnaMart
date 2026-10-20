import React, { useEffect, useState } from 'react';
import { orderApi } from '../api';
import OrderBillModal from './OrderBillModal';

export default function OrderTrackingModal({ order: initialOrder, onClose, onOrderUpdated }) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const refreshOrder = async () => {
    if (!order?.id) return;
    try {
      setLoading(true);
      const res = await orderApi.getOrderById(order.id);
      if (res && res.data) {
        setOrder(res.data);
        if (onOrderUpdated) onOrderUpdated(res.data);
      }
    } catch (err) {
      console.error('Error refreshing order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Poll every 10 seconds while modal is open for live tracking
    const interval = setInterval(() => {
      refreshOrder();
    }, 10000);
    return () => clearInterval(interval);
  }, [order?.id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Reserved items and pickup slot will be released.')) {
      return;
    }
    try {
      setCancelling(true);
      const res = await orderApi.cancelOrder(order.id);
      if (res && res.data) {
        setOrder(res.data);
        if (onOrderUpdated) onOrderUpdated(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStepProgress = () => {
    switch (order.orderStatus) {
      case 'PENDING': return 10;
      case 'ACCEPTED': return 45;
      case 'READY_FOR_PICKUP': return 80;
      case 'COMPLETED': return 100;
      default: return 0;
    }
  };

  const isTerminal = order.orderStatus === 'CANCELLED' || order.orderStatus === 'REJECTED';

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden printable-slip">
          {/* Header */}
          <div className="modal-header bg-success text-white py-3 border-0">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="pulsing-live-dot"></span>
                <h5 className="modal-title fw-bold m-0 text-white">Live Pre-Order Tracking</h5>
              </div>
              <small className="text-white-50">Order #{order.orderNumber}</small>
            </div>
            <div className="d-flex align-items-center gap-2 no-print">
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
                onClick={refreshOrder}
                disabled={loading}
                title="Refresh order status"
              >
                <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'spin' : ''}`}></i>
                Live Refresh
              </button>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
          </div>

          <div className="modal-body p-4 bg-white">
            {errorMsg && (
              <div className="alert alert-danger py-2 small mb-3 no-print">
                {errorMsg}
              </div>
            )}

            {/* Live Progress Tracker Stepper */}
            {!isTerminal ? (
              <div className="mb-4">
                <div className="tracking-stepper">
                  <div className="tracking-stepper-progress" style={{ width: `${getStepProgress()}%` }}></div>

                  {/* Step 1: Placed */}
                  <div className={`tracking-node ${getStepProgress() >= 10 ? (getStepProgress() === 10 ? 'active' : 'completed') : ''}`}>
                    <div className="tracking-node-icon">
                      <i className="bi bi-receipt"></i>
                    </div>
                    <span className="tracking-node-title">Order Placed</span>
                    <span className="tracking-node-desc">Sent to store</span>
                  </div>

                  {/* Step 2: Accepted & Packing */}
                  <div className={`tracking-node ${getStepProgress() >= 45 ? (getStepProgress() === 45 ? 'active' : 'completed') : ''}`}>
                    <div className="tracking-node-icon">
                      <i className="bi bi-box-seam"></i>
                    </div>
                    <span className="tracking-node-title">Packing</span>
                    <span className="tracking-node-desc">Items being bagged</span>
                  </div>

                  {/* Step 3: Ready for Pickup */}
                  <div className={`tracking-node ${getStepProgress() >= 80 ? (getStepProgress() === 80 ? 'active' : 'completed') : ''}`}>
                    <div className="tracking-node-icon">
                      <i className="bi bi-bag-check"></i>
                    </div>
                    <span className="tracking-node-title">Ready for Pickup</span>
                    <span className="tracking-node-desc">Waiting at counter</span>
                  </div>

                  {/* Step 4: Completed */}
                  <div className={`tracking-node ${getStepProgress() === 100 ? 'completed' : ''}`}>
                    <div className="tracking-node-icon">
                      <i className="bi bi-check2-all"></i>
                    </div>
                    <span className="tracking-node-title">Collected</span>
                    <span className="tracking-node-desc">Order finished</span>
                  </div>
                </div>

                {/* Status Callout Banner */}
                {order.orderStatus === 'PENDING' && (
                  <div className="alert alert-warning py-3 rounded-3 d-flex align-items-center gap-3">
                    <i className="bi bi-hourglass-split fs-3 text-warning"></i>
                    <div>
                      <strong className="d-block text-dark">Order Received by Store</strong>
                      <span className="small text-secondary">
                        The shopkeeper at <strong>{order.storeName}</strong> has received your pre-order and will confirm and pack items shortly.
                      </span>
                    </div>
                  </div>
                )}

                {order.orderStatus === 'ACCEPTED' && (
                  <div className="alert alert-primary py-3 rounded-3 d-flex align-items-center gap-3">
                    <i className="bi bi-box2-fill fs-3 text-primary"></i>
                    <div>
                      <strong className="d-block text-dark">Shopkeeper is Packing Your Goods!</strong>
                      <span className="small text-secondary">
                        Your grocery items are being weighed, verified, and packed. You will be notified when ready for pickup counter collection.
                      </span>
                    </div>
                  </div>
                )}

                {order.orderStatus === 'READY_FOR_PICKUP' && (
                  <div className="p-3 rounded-4 mb-3 border-2 border border-success bg-success-subtle text-success-emphasis">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-check-circle-fill fs-2 text-success"></i>
                        <div>
                          <h6 className="fw-bold m-0 text-success">Ready for Counter Pickup!</h6>
                          <small>Your grocery bag is packed and waiting at the counter.</small>
                        </div>
                      </div>
                      <div className="text-end bg-white px-3 py-2 rounded-3 border">
                        <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Counter Token</small>
                        <span className="fs-5 fw-bold text-success">#{order.orderNumber.substring(order.orderNumber.length - 4)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {order.orderStatus === 'COMPLETED' && (
                  <div className="alert alert-success py-3 rounded-3 d-flex align-items-center gap-3">
                    <i className="bi bi-bag-check-fill fs-3 text-success"></i>
                    <div>
                      <strong className="d-block text-dark">Order Collected & Completed</strong>
                      <span className="small text-secondary">
                        Thank you for shopping at your neighbourhood store <strong>{order.storeName}</strong>!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-danger py-3 rounded-3 d-flex align-items-center gap-3 mb-4">
                <i className="bi bi-x-circle-fill fs-3 text-danger"></i>
                <div>
                  <strong className="d-block text-dark">
                    Order {order.orderStatus === 'CANCELLED' ? 'Cancelled' : 'Rejected by Store'}
                  </strong>
                  <span className="small text-secondary">
                    All reserved stock quantities and your pickup slot capacity have been released back to the store.
                  </span>
                </div>
              </div>
            )}

            {/* Store & Schedule Info */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Store Details</small>
                    {order.storePhone && (
                      <a href={`tel:${order.storePhone}`} className="btn btn-sm btn-outline-success rounded-pill py-0 px-2 no-print">
                        <i className="bi bi-telephone-fill me-1"></i> Call Store
                      </a>
                    )}
                  </div>
                  <strong className="text-dark d-block fs-6">{order.storeName}</strong>
                  <div className="small text-secondary"><i className="bi bi-geo-alt me-1 text-success"></i>{order.storeAddress}</div>
                  {order.storePhone && <div className="small text-secondary mt-1"><i className="bi bi-phone me-1"></i>{order.storePhone}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Pickup Window</small>
                  <div className="mt-1">
                    <strong className="text-dark fs-6 d-block">
                      <i className="bi bi-calendar-event me-1 text-success"></i> {order.pickupDate}
                    </strong>
                    <div className="small text-secondary">
                      <i className="bi bi-clock me-1 text-success"></i> {order.pickupTime}
                    </div>
                    <div className="small text-muted mt-1">
                      Payment: <strong>{order.paymentMethod === 'CASH_ON_PICKUP' ? 'Cash on Pickup' : 'Pay at Store'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goods / Items Ordered */}
            <h6 className="fw-bold text-dark mb-2 d-flex justify-content-between align-items-center">
              <span>Ordered Goods & Essentials ({order.items?.length || 0} items)</span>
              <span className="badge bg-light text-dark border">Pre-Order Snapshot</span>
            </h6>

            <div className="table-responsive mb-3 border rounded-3">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted">
                    <th scope="col">#</th>
                    <th scope="col">Product</th>
                    <th scope="col" className="text-center">Rate</th>
                    <th scope="col" className="text-center">Qty</th>
                    <th scope="col" className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td>
                        <strong className="text-dark small d-block">{item.productName}</strong>
                      </td>
                      <td className="text-center small text-muted">₹{item.unitPrice}</td>
                      <td className="text-center fw-bold">{item.quantity}</td>
                      <td className="text-end fw-bold text-dark">₹{item.lineTotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="4" className="text-end fw-bold text-dark">Total Bill to Pay at Counter:</td>
                    <td className="text-end fw-bold text-success fs-6">₹{order.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {order.customerNote && (
              <div className="p-3 bg-warning-subtle rounded-3 small mb-3">
                <i className="bi bi-chat-left-text-fill me-2 text-warning-emphasis"></i>
                <strong>Your Special Note:</strong> "{order.customerNote}"
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="modal-footer bg-light py-2 d-flex justify-content-between no-print">
            <div>
              {(order.orderStatus === 'PENDING' || order.orderStatus === 'ACCEPTED') && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Pre-Order'}
                </button>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold"
                onClick={() => setShowBill(true)}
                id="modal-view-bill-btn"
              >
                <i className="bi bi-printer me-1"></i> Print / Download Bill
              </button>
              <button type="button" className="btn btn-sm btn-success rounded-pill px-4" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBill && (
        <OrderBillModal
          order={order}
          onClose={() => setShowBill(false)}
        />
      )}
    </div>
  );
}
