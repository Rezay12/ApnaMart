import React, { useState } from 'react';

export default function SellerPackingModal({ order, onClose, onUpdateStatus }) {
  const [packedItems, setPackedItems] = useState({});
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const toggleItemPacked = (itemId) => {
    setPackedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleMarkAllPacked = () => {
    const all = {};
    order.items?.forEach((it) => {
      all[it.id] = true;
    });
    setPackedItems(all);
  };

  const handleStatusChange = async (nextStatus) => {
    try {
      setUpdating(true);
      await onUpdateStatus(order.id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  const allChecked = order.items?.length > 0 && order.items.every((it) => packedItems[it.id]);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden printable-slip">
          {/* Header */}
          <div className="modal-header bg-dark text-white py-3 border-0">
            <div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-box2-fill text-warning fs-5"></i>
                <h5 className="modal-title fw-bold m-0 text-white">
                  Order Packing Slip & Verification
                </h5>
              </div>
              <small className="text-white-50">Pre-Order #{order.orderNumber}</small>
            </div>
            <div className="d-flex gap-2 no-print">
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-3"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-1"></i> Print Slip
              </button>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
          </div>

          <div className="modal-body p-4 bg-white">
            {/* Customer & Slot Info Bar */}
            <div className="row g-3 mb-3 p-3 bg-light rounded-3">
              <div className="col-sm-6">
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Customer Details</small>
                <strong className="text-dark fs-6 d-block">{order.customerName}</strong>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className="small text-muted">{order.customerPhone}</span>
                  {order.customerPhone && (
                    <a href={`tel:${order.customerPhone}`} className="badge bg-success text-white text-decoration-none no-print">
                      <i className="bi bi-telephone-fill me-1"></i> Call
                    </a>
                  )}
                </div>
              </div>

              <div className="col-sm-6">
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Pickup Window</small>
                <strong className="text-dark fs-6 d-block">
                  <i className="bi bi-calendar-check me-1 text-success"></i> {order.pickupDate}
                </strong>
                <small className="text-muted">Slot: {order.pickupTime}</small>
                <div className="mt-1">
                  <span className="badge bg-warning text-dark border">
                    Payment: {order.paymentMethod === 'CASH_ON_PICKUP' ? 'Cash / UPI at Counter' : 'Pay at Store'}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Instructions Callout */}
            {order.customerNote && (
              <div className="alert alert-warning py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-chat-quote-fill fs-5 text-warning-emphasis"></i>
                <div>
                  <strong>Customer Special Instructions:</strong> "{order.customerNote}"
                </div>
              </div>
            )}

            {/* Items Checklist to Pack */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold text-dark m-0">
                Goods to Pack ({order.items?.length || 0} items)
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-link text-success text-decoration-none p-0 fw-semibold no-print"
                onClick={handleMarkAllPacked}
              >
                <i className="bi bi-check-all me-1"></i> Mark All as Packed
              </button>
            </div>

            <div className="table-responsive border rounded-3 mb-3">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted">
                    <th scope="col" style={{ width: '40px' }} className="no-print">Pack</th>
                    <th scope="col">Item Description</th>
                    <th scope="col" className="text-center">Rate</th>
                    <th scope="col" className="text-center">Quantity</th>
                    <th scope="col" className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => {
                    const isPacked = packedItems[item.id];
                    return (
                      <tr key={item.id} className={`packing-item-row ${isPacked ? 'packed' : ''}`}>
                        <td className="no-print text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={!!isPacked}
                            onChange={() => toggleItemPacked(item.id)}
                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                          />
                        </td>
                        <td>
                          <span className={`item-name fw-bold small text-dark d-block`}>
                            {item.productName}
                          </span>
                        </td>
                        <td className="text-center small text-muted">₹{item.unitPrice}</td>
                        <td className="text-center fw-bold fs-6 text-dark">{item.quantity}</td>
                        <td className="text-end fw-bold text-dark">₹{item.lineTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="4" className="text-end fw-bold text-dark">Total Bill to Collect:</td>
                    <td className="text-end fw-bold text-success fs-5">₹{order.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Current Order State Banner */}
            <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light border">
              <div>
                <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Current Order Status</small>
                <span className="badge px-3 py-1 fs-6 bg-secondary">{order.orderStatus}</span>
              </div>
              <div className="text-end">
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Counter Token ID</small>
                <span className="fw-bold text-success fs-6">#{order.orderNumber.substring(order.orderNumber.length - 4)}</span>
              </div>
            </div>
          </div>

          {/* Action Progression Controls for Shopkeeper */}
          <div className="modal-footer bg-light py-3 d-flex justify-content-between no-print">
            <div>
              {order.orderStatus === 'PENDING' && (
                <button
                  type="button"
                  className="btn btn-outline-danger rounded-pill px-3 me-2"
                  onClick={() => handleStatusChange('REJECTED')}
                  disabled={updating}
                >
                  <i className="bi bi-x-circle me-1"></i> Reject Pre-Order
                </button>
              )}
            </div>

            <div className="d-flex gap-2">
              {order.orderStatus === 'PENDING' && (
                <button
                  type="button"
                  className="btn btn-success rounded-pill px-4 fw-bold"
                  onClick={() => handleStatusChange('ACCEPTED')}
                  disabled={updating}
                >
                  <i className="bi bi-check-circle me-1"></i> Accept & Start Packing
                </button>
              )}

              {order.orderStatus === 'ACCEPTED' && (
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 fw-bold"
                  onClick={() => handleStatusChange('READY_FOR_PICKUP')}
                  disabled={updating}
                >
                  <i className="bi bi-box-seam-fill me-1"></i> Mark Packed & Ready for Pickup
                </button>
              )}

              {order.orderStatus === 'READY_FOR_PICKUP' && (
                <button
                  type="button"
                  className="btn btn-success rounded-pill px-4 fw-bold"
                  onClick={() => handleStatusChange('COMPLETED')}
                  disabled={updating}
                >
                  <i className="bi bi-bag-check-fill me-1"></i> Confirm Customer Collected (Complete)
                </button>
              )}

              <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
