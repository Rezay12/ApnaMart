import React, { useRef } from 'react';

export default function OrderBillModal({ order, onClose }) {
  const billRef = useRef();

  if (!order) return null;

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : order.pickupDate || new Date().toLocaleDateString('en-IN');

  const items = order.items || [];
  const itemCount = items.reduce((s, i) => s + (i.quantity || 1), 0);
  const totalAmount = order.totalAmount ?? order.subtotal ?? 0;
  const subtotal = order.subtotal ?? totalAmount;

  const buildHtmlInvoice = () => {
    const itemsRows = items
      .map(
        (it, idx) => `
        <tr>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${idx + 1}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
            <strong>${it.productName || 'Grocery Item'}</strong>
          </td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px;">${it.quantity}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 13px;">₹${Number(it.unitPrice || 0).toFixed(2)}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; font-size: 13px;">₹${Number(it.lineTotal || (it.unitPrice * it.quantity) || 0).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>ApnaMart Invoice #${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 24px; background: #fff; }
          .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 12px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { text-align: center; border-bottom: 2px dashed #94a3b8; padding-bottom: 16px; margin-bottom: 16px; }
          .brand { font-size: 26px; font-weight: 900; color: #1B4D3E; letter-spacing: 1px; margin: 0; }
          .tagline { font-size: 12px; color: #64748b; margin-top: 2px; }
          .store-name { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 10px; }
          .store-addr { font-size: 12px; color: #64748b; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
          .info-table td { padding: 4px 0; }
          .divider { border-top: 1px dashed #cbd5e1; margin: 12px 0; }
          table.items { width: 100%; border-collapse: collapse; margin-top: 8px; }
          table.items th { background: #f8fafc; text-align: left; padding: 8px; font-size: 11px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #cbd5e1; }
          .total-box { margin-top: 16px; border-top: 2px solid #1B4D3E; padding-top: 10px; }
          .total-row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
          .grand-total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #1B4D3E; border-top: 1px dashed #94a3b8; padding-top: 8px; margin-top: 8px; }
          .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; text-transform: uppercase; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
          @media print {
            body { padding: 0; }
            .receipt { border: none; box-shadow: none; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1 class="brand">APNAMART</h1>
            <div class="tagline">Hyperlocal Kirana Pre-Ordering Platform</div>
            <div class="store-name">${order.storeName || 'Neighbourhood Kirana Store'}</div>
            <div class="store-addr">${order.storeAddress || ''}</div>
          </div>

          <table class="info-table">
            <tr>
              <td><strong>Invoice No:</strong> #${order.orderNumber}</td>
              <td style="text-align: right;"><strong>Date:</strong> ${orderDate}</td>
            </tr>
            <tr>
              <td><strong>Customer:</strong> ${order.customerName || 'Registered Customer'}</td>
              <td style="text-align: right;"><strong>Pickup Slot:</strong> ${order.pickupDate || ''} (${order.pickupTime || ''})</td>
            </tr>
            <tr>
              <td><strong>Payment Method:</strong> ${order.paymentMethod === 'CASH_ON_PICKUP' ? 'Cash on Pickup' : 'Pay at Store'}</td>
              <td style="text-align: right;">
                <strong>Order Status:</strong> <span class="status-badge">${order.orderStatus || 'PENDING'}</span>
              </td>
            </tr>
          </table>

          <div class="divider"></div>

          <table class="items">
            <thead>
              <tr>
                <th style="width: 30px;">#</th>
                <th>Item Description</th>
                <th style="text-align: center; width: 50px;">Qty</th>
                <th style="text-align: right; width: 80px;">Rate</th>
                <th style="text-align: right; width: 90px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-row">
              <span style="color: #64748b;">Subtotal (${itemCount} items)</span>
              <span>₹${Number(subtotal).toFixed(2)}</span>
            </div>
            ${order.discountAmount > 0 ? `
            <div class="total-row" style="color: #15803d; font-weight: 700;">
              <span>Coupon Discount (${order.couponCode || 'PROMO'})</span>
              <span>-₹${Number(order.discountAmount).toFixed(2)}</span>
            </div>` : ''}
            <div class="total-row" style="color: #15803d;">
              <span>Store Pickup / Delivery</span>
              <span>FREE</span>
            </div>
            <div class="total-row" style="color: #64748b;">
              <span>Taxes (GST)</span>
              <span>₹0.00</span>
            </div>
            <div class="grand-total">
              <span>TOTAL AMOUNT</span>
              <span>₹${Number(totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 4px; font-weight: 600; color: #475569;">Thank you for shopping at your local neighborhood kirana!</p>
            <p style="margin: 0;">Pre-order verified by ApnaMart • Keep this receipt for verification during counter collection</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const html = buildHtmlInvoice();
    const w = window.open('', '_blank', 'width=750,height=900');
    if (!w) {
      alert('Please allow popups to print the bill.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 400);
  };

  const handleDownload = () => {
    const html = buildHtmlInvoice();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ApnaMart_Bill_${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        zIndex: 10500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          background: '#fff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #1B4D3E, #0f7f56)',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
            >
              <i className="bi bi-receipt"></i>
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                Official Order Bill / Receipt
              </h5>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                Order #{order.orderNumber}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.3rem',
              cursor: 'pointer',
              opacity: 0.8,
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Scrollable Bill Content */}
        <div
          ref={billRef}
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            background: '#F8FAFC',
            flex: 1,
          }}
        >
          {/* Card containing receipt style */}
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* Top brand */}
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #CBD5E1', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontWeight: 900, color: '#1B4D3E', letterSpacing: '1px', fontSize: '1.5rem' }}>
                APNAMART
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Local Kirana Pre-Ordering Network</div>
              <div style={{ fontWeight: 700, color: '#1E293B', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                {order.storeName || 'Neighbourhood Store'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{order.storeAddress}</div>
            </div>

            {/* Metadata grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ color: '#64748B' }}>Order Number:</span>
                <div style={{ fontWeight: 700, color: '#1E293B', fontFamily: 'monospace' }}>#{order.orderNumber}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748B' }}>Order Date:</span>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>{orderDate}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Pickup Window:</span>
                <div style={{ fontWeight: 600, color: '#15803d' }}>
                  {order.pickupDate} ({order.pickupTime})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748B' }}>Order Status:</span>
                <div>
                  <span
                    style={{
                      background: order.orderStatus === 'COMPLETED' ? '#dcfce7' : '#eff6ff',
                      color: order.orderStatus === 'COMPLETED' ? '#15803d' : '#1d4ed8',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {order.orderStatus || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', margin: '0.75rem 0' }}></div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #CBD5E1', color: '#64748B' }}>
                  <th style={{ textAlign: 'left', padding: '6px 4px' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '6px 4px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '6px 4px' }}>Rate</th>
                  <th style={{ textAlign: 'right', padding: '6px 4px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 600, color: '#1E293B' }}>
                      {it.productName}
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px 4px', color: '#475569' }}>
                      {it.quantity}
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 4px', color: '#64748B' }}>
                      ₹{Number(it.unitPrice || 0).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 4px', fontWeight: 700, color: '#1B4D3E' }}>
                      ₹{Number(it.lineTotal || (it.unitPrice * it.quantity) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial summary */}
            <div style={{ borderTop: '2px dashed #CBD5E1', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span style={{ color: '#64748B' }}>Subtotal ({itemCount} items):</span>
                <span style={{ fontWeight: 600 }}>₹{Number(subtotal).toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4, color: '#15803d', fontWeight: 700 }}>
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span>-₹{Number(order.discountAmount).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4, color: '#15803d' }}>
                <span>Pickup / Delivery:</span>
                <span style={{ fontWeight: 700 }}>FREE STORE PICKUP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4, color: '#64748B' }}>
                <span>Taxes (GST):</span>
                <span>₹0.00</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#1B4D3E',
                  borderTop: '2px solid #1E293B',
                  paddingTop: 8,
                  marginTop: 6,
                }}
              >
                <span>TOTAL PAID / TO PAY:</span>
                <span>₹{Number(totalAmount).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94A3B8', marginTop: '1.25rem', borderTop: '1px dashed #E2E8F0', paddingTop: '0.75rem' }}>
              Payment Method: <strong>{order.paymentMethod === 'CASH_ON_PICKUP' ? 'Cash on Pickup' : 'Pay at Counter'}</strong>
              <div style={{ marginTop: 2 }}>Keep this digital receipt for convenient order collection.</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '0.75rem',
            background: '#fff',
          }}
        >
          <button
            onClick={handlePrint}
            className="btn btn-success fw-bold py-2 flex-grow-1"
            style={{ borderRadius: 12, background: '#1B4D3E', borderColor: '#1B4D3E' }}
            id="print-order-receipt-btn"
          >
            <i className="bi bi-printer me-2"></i>Print Bill
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-outline-success fw-bold py-2 flex-grow-1"
            style={{ borderRadius: 12 }}
            id="download-order-bill-btn"
          >
            <i className="bi bi-download me-2"></i>Download Bill
          </button>
          <button
            onClick={onClose}
            className="btn btn-outline-secondary py-2 px-4 rounded-pill"
            style={{ fontWeight: 600 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
