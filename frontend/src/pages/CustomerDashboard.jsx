import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderApi } from '../api';
import { useAuth } from '../context/AuthContext';
import OrderTrackingModal from '../components/OrderTrackingModal';
import OrderBillModal from '../components/OrderBillModal';

const STATUS_CONFIG = {
  PENDING:          { badge: 'badge-pending',   label: 'Pending',        icon: 'bi-clock-history' },
  ACCEPTED:         { badge: 'badge-accepted',  label: 'Accepted',       icon: 'bi-check-circle' },
  READY_FOR_PICKUP: { badge: 'badge-ready',     label: 'Ready for Pickup', icon: 'bi-bag-check' },
  COMPLETED:        { badge: 'badge-completed', label: 'Completed',      icon: 'bi-check2-circle' },
  CANCELLED:        { badge: 'badge-cancelled', label: 'Cancelled',      icon: 'bi-x-circle' },
  REJECTED:         { badge: 'badge-rejected',  label: 'Rejected',       icon: 'bi-x-circle' },
};

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isOrdersView = location.pathname.includes('/orders');

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [billOrder, setBillOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionMsg, setActionMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([orderApi.getCustomerDashboard(), orderApi.getMyOrders()])
      .then(([dashRes, ordersRes]) => {
        if (dashRes.data) setStats(dashRes.data);
        if (ordersRes.data) setOrders(ordersRes.data);
      })
      .catch((err) => console.error('Error loading dashboard:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this pre-order? Your reserved stock and pickup slot will be released.')) return;
    try {
      await orderApi.cancelOrder(orderId);
      setActionMsg('Order cancelled successfully.');
      loadData();
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ACTIVE') return ['PENDING', 'ACCEPTED', 'READY_FOR_PICKUP'].includes(o.orderStatus);
    if (statusFilter === 'COMPLETED') return o.orderStatus === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return ['CANCELLED', 'REJECTED'].includes(o.orderStatus);
    return true;
  });

  const STATS_CONFIG = [
    { label: 'Total Orders', value: stats?.totalOrders ?? orders.length, icon: 'bi-bag', bg: '#E0F2FE', color: '#0284C7' },
    { label: 'Pending', value: stats?.pendingOrders ?? 0, icon: 'bi-clock-history', bg: '#FEF3C7', color: '#D97706' },
    { label: 'Completed', value: stats?.completedOrders ?? 0, icon: 'bi-check2-circle', bg: '#DCFCE7', color: '#16A34A' },
    { label: 'Cancelled', value: stats?.cancelledOrders ?? 0, icon: 'bi-x-circle', bg: '#FEE2E2', color: '#DC2626' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Profile */}
        <div className="sidebar-profile-card">
          <div className="sidebar-avatar">{getInitials(user?.fullName)}</div>
          <div>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', display: 'block' }}>{user?.fullName || 'Customer'}</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'block' }}>Customer Account</span>
          </div>
        </div>

        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.75rem', display: 'block' }}>
          Navigation
        </span>

        <nav className="nav flex-column">
          {[
            { to: '/customer/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', active: !isOrdersView },
            { to: '/customer/orders', icon: 'bi-bag-check', label: 'My Orders', active: isOrdersView },
            { to: '/cart', icon: 'bi-cart3', label: 'My Cart', active: false },
            { to: '/stores', icon: 'bi-shop', label: 'Browse Stores', active: false },
          ].map(link => (
            <Link key={link.to} to={link.to} className={`sidebar-nav-link ${link.active ? 'active' : ''}`}>
              <i className={`bi ${link.icon} sidebar-nav-icon`}></i> {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button
            className="sidebar-nav-link border-0 bg-transparent w-100 text-start"
            style={{ color: '#fca5a5', cursor: 'pointer' }}
            onClick={logout}
          >
            <i className="bi bi-box-arrow-left sidebar-nav-icon"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {actionMsg && (
          <div className="alert d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded-3 animate-fade-in"
            style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.875rem' }}>
            <i className="bi bi-check-circle-fill"></i> {actionMsg}
          </div>
        )}

        {/* Page header */}
        <div className="page-hero mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h1 className="page-hero-title">
                {isOrdersView ? '📦 My Orders & Purchase History' : `👋 Welcome, ${user?.fullName?.split(' ')[0] || 'Customer'}!`}
              </h1>
              <p className="page-hero-sub">
                {isOrdersView
                  ? 'Track live packing status, inspect itemized purchase details and download official bills.'
                  : "Here's what's happening with your orders and pickup schedule."}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/stores" className="btn-apnamart-primary btn" style={{ borderRadius: 12 }}>
                <i className="bi bi-plus-circle me-2"></i>New Order
              </Link>
              <button
                className="btn btn-outline-secondary rounded-pill px-3"
                onClick={loadData}
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="row row-cols-2 row-cols-lg-4 g-3 mb-4">
          {STATS_CONFIG.map((s, i) => (
            <div className="col" key={i}>
              <div className="stat-card">
                <div>
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-number">{s.value}</p>
                </div>
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                  <i className={`bi ${s.icon}`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="premium-card">
          <div className="premium-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <span className="premium-card-title">
                <i className="bi bi-list-ul me-2 text-success"></i>My Orders &amp; Purchase History
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginLeft: '0.5rem' }}>
                ({filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'})
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="d-flex gap-1 flex-wrap">
              {[
                { key: 'ALL', label: `All (${orders.length})` },
                { key: 'ACTIVE', label: `Active (${orders.filter(o => ['PENDING', 'ACCEPTED', 'READY_FOR_PICKUP'].includes(o.orderStatus)).length})` },
                { key: 'COMPLETED', label: `Completed (${orders.filter(o => o.orderStatus === 'COMPLETED').length})` },
                { key: 'CANCELLED', label: `Cancelled (${orders.filter(o => ['CANCELLED', 'REJECTED'].includes(o.orderStatus)).length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  style={{
                    border: 'none',
                    borderRadius: 20,
                    padding: '3px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: statusFilter === tab.key ? '#1B4D3E' : '#F1F5F9',
                    color: statusFilter === tab.key ? '#fff' : '#64748B',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="spinner-border text-success mb-2" style={{ width: '2rem', height: '2rem' }} role="status"></div>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-bag-x" style={{ fontSize: '3rem', color: '#CBD5E1', display: 'block', marginBottom: '1rem' }}></i>
              <h5 style={{ fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
                {statusFilter === 'ALL' ? 'No orders yet' : `No ${statusFilter.toLowerCase()} orders found`}
              </h5>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: '0 auto 1.5rem', maxWidth: 280 }}>
                Start browsing local stores and pre-order your essentials!
              </p>
              <Link to="/stores" className="btn-apnamart-primary btn px-5">
                <i className="bi bi-shop-window me-2"></i>Browse Stores
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ minWidth: 840 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Order No.', 'Store', 'Items Ordered', 'Pickup Slot', 'Status', 'Total', 'Actions'].map(h => (
                      <th key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9', borderTop: 'none', background: '#F8FAFC' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const sc = STATUS_CONFIG[order.orderStatus] || { badge: 'bg-secondary', label: order.orderStatus, icon: 'bi-circle' };
                    const isActive = ['PENDING', 'ACCEPTED', 'READY_FOR_PICKUP'].includes(order.orderStatus);
                    const canCancel = ['PENDING', 'ACCEPTED'].includes(order.orderStatus);
                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s', cursor: 'pointer' }}
                        onClick={() => setSelectedOrder(order)}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{ fontWeight: 800, color: '#1B4D3E', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            #{order.orderNumber}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{order.storeName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.storeAddress}</div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 220 }}>
                            {order.items?.slice(0, 3).map((it) => (
                              <span key={it.id} style={{
                                background: '#F1F5F9', borderRadius: 6, padding: '2px 8px',
                                fontSize: '0.73rem', fontWeight: 500, color: '#475569'
                              }}>
                                <strong style={{ color: '#1B4D3E' }}>{it.quantity}×</strong> {it.productName}
                              </span>
                            ))}
                            {order.items?.length > 3 && (
                              <span style={{ background: '#F1F5F9', borderRadius: 6, padding: '2px 8px', fontSize: '0.73rem', color: '#94A3B8' }}>
                                +{order.items.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{order.pickupDate}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{order.pickupTime}</div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span className={`badge px-2 py-1 rounded-pill ${sc.badge}`} style={{ fontSize: '0.73rem', fontWeight: 700 }}>
                            {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#1B4D3E', fontSize: '0.95rem' }}>
                          ₹{order.totalAmount}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div className="d-flex gap-1 align-items-center flex-wrap" onClick={e => e.stopPropagation()}>
                            {/* Track / Details */}
                            <button
                              type="button"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.3rem 0.75rem', borderRadius: 999, border: 'none',
                                background: '#1B4D3E', color: '#fff',
                                fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                                whiteSpace: 'nowrap', transition: 'all 0.2s'
                              }}
                              onClick={() => setSelectedOrder(order)}
                              title="View details and live status"
                              onMouseEnter={e => e.currentTarget.style.background = '#0f7f56'}
                              onMouseLeave={e => e.currentTarget.style.background = '#1B4D3E'}
                            >
                              {isActive && <span className="pulsing-live-dot" style={{ width: 6, height: 6 }}></span>}
                              <i className="bi bi-geo-alt-fill"></i> Track
                            </button>

                            {/* View / Download Bill */}
                            <button
                              type="button"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.3rem 0.75rem', borderRadius: 999,
                                border: '1.5px solid #1B4D3E', background: '#EBF5F0',
                                color: '#1B4D3E', fontWeight: 600, fontSize: '0.75rem',
                                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                              }}
                              onClick={() => setBillOrder(order)}
                              title="Download or Print Bill"
                              onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                              onMouseLeave={e => e.currentTarget.style.background = '#EBF5F0'}
                            >
                              <i className="bi bi-printer"></i> Bill
                            </button>

                            {canCancel && (
                              <button
                                type="button"
                                style={{
                                  padding: '0.3rem 0.75rem', borderRadius: 999,
                                  border: '1.5px solid #fca5a5', background: 'transparent',
                                  color: '#dc2626', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onClick={() => handleCancelOrder(order.id)}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Tracking / Details Modal */}
      {selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(updated) => {
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
            setSelectedOrder(updated);
          }}
        />
      )}

      {/* Printable / Downloadable Bill Modal */}
      {billOrder && (
        <OrderBillModal
          order={billOrder}
          onClose={() => setBillOrder(null)}
        />
      )}
    </div>
  );
}
