import React, { useEffect, useState } from 'react';
import { adminApi, couponApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'stores', 'users', 'categories', 'orders', 'coupons'
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [couponSubmitting, setCouponSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Category form
  const [newCat, setNewCat] = useState({ name: '', description: '', iconName: 'bi-tag' });

  // Coupon form
  const [couponForm, setCouponForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    endDate: '',
    badge: '⚡ LIMITED TIME',
    storeId: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getDashboard(),
      adminApi.getStores(),
      adminApi.getUsers(),
      adminApi.getCategories(),
      adminApi.getAllOrders(),
      couponApi.getAllCoupons().catch(() => ({ data: [] })),
    ])
      .then(([dashRes, storesRes, usersRes, catRes, ordersRes, couponsRes]) => {
        if (dashRes.data) setStats(dashRes.data);
        if (storesRes.data) setStores(storesRes.data);
        if (usersRes.data) setUsers(usersRes.data);
        if (catRes.data) setCategories(catRes.data);
        if (ordersRes.data) setAllOrders(ordersRes.data);
        if (couponsRes?.data) setCoupons(couponsRes.data);
      })
      .catch((err) => console.error('Error loading admin dashboard:', err))
      .finally(() => setLoading(false));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponSubmitting(true);
    try {
      const payload = {
        code: couponForm.code.toUpperCase().trim(),
        title: couponForm.title.trim(),
        description: couponForm.description.trim(),
        discountType: couponForm.discountType,
        discountValue: parseFloat(couponForm.discountValue),
        minOrderAmount: couponForm.minOrderAmount ? parseFloat(couponForm.minOrderAmount) : null,
        maxDiscountAmount: couponForm.maxDiscountAmount ? parseFloat(couponForm.maxDiscountAmount) : null,
        badge: couponForm.badge || null,
        storeId: couponForm.storeId ? parseInt(couponForm.storeId, 10) : null,
        endDate: couponForm.endDate ? new Date(couponForm.endDate).toISOString() : null,
      };
      await couponApi.createCoupon(payload);
      setActionMsg('Platform / Store coupon created successfully!');
      setShowCreateCouponModal(false);
      setCouponForm({
        code: '',
        title: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        endDate: '',
        badge: '⚡ LIMITED TIME',
        storeId: '',
      });
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to create coupon');
    } finally {
      setCouponSubmitting(false);
    }
  };

  const handleToggleCoupon = async (couponId) => {
    try {
      await couponApi.toggleCouponStatus(couponId);
      setActionMsg('Coupon status updated.');
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update coupon status');
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await couponApi.deleteCoupon(couponId);
      setActionMsg('Coupon deleted successfully.');
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveStore = async (storeId, status) => {
    try {
      await adminApi.updateStoreApproval(storeId, status);
      setActionMsg(`Store approval status updated to ${status}`);
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update store approval');
    }
  };

  const handleToggleStoreStatus = async (storeId) => {
    try {
      await adminApi.toggleStoreStatus(storeId);
      setActionMsg('Store status toggled.');
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to toggle store status');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminApi.toggleUserStatus(userId);
      setActionMsg('User status updated.');
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to toggle user status');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCategory(newCat);
      setActionMsg('Category created successfully!');
      setNewCat({ name: '', description: '', iconName: 'bi-tag' });
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to create category');
    }
  };

  const pendingStores = stores.filter((s) => s.approvalStatus === 'PENDING');

  return (
    <div className="dashboard-layout">
      {/* Admin Sidebar */}
      <aside className="dashboard-sidebar">
          <div className="sidebar-profile-card">
            <div className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
              <i className="bi bi-shield-lock-fill fs-5"></i>
            </div>
            <div>
              <div className="fw-bold text-white small">{user?.fullName || 'Admin'}</div>
              <small className="text-white-50">Administrator</small>
            </div>
          </div>

          <nav className="nav flex-column">
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'dashboard' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="bi bi-speedometer2"></i> Dashboard
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'users' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people"></i> Users ({users.length})
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'stores' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('stores')}
            >
              <i className="bi bi-shop"></i> Stores ({stores.length})
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'categories' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('categories')}
            >
              <i className="bi bi-tags"></i> Categories
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'orders' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="bi bi-receipt"></i> Orders Audit
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'coupons' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('coupons')}
            >
              <i className="bi bi-ticket-perforated"></i> Coupons & Deals ({coupons.length})
            </button>

            <button className="sidebar-nav-link border-0 bg-transparent text-danger mt-4 text-start" onClick={logout}>
              <i className="bi bi-box-arrow-left"></i> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          {actionMsg && (
            <div className="alert alert-success alert-dismissible fade show shadow-sm py-2 px-3 mb-3">
              <i className="bi bi-check-circle-fill me-2"></i> {actionMsg}
            </div>
          )}

          {/* Header */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Platform Overview</h3>
            <p className="text-muted small m-0">Live metrics across customers, kiranas, pre-orders, and platform turnover.</p>
          </div>

          {/* 4 Stat Cards matching Screen 8 */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Users</div>
                  <div className="stat-number">{stats?.totalUsers ?? users.length}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Stores</div>
                  <div className="stat-number text-success">{stats?.totalStores ?? stores.length}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                  <i className="bi bi-shop"></i>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-number text-warning">{stats?.totalOrders ?? allOrders.length}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  <i className="bi bi-bag-check"></i>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-number text-success">₹{stats?.totalRevenue ?? '12,450'}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#F3E8FF', color: '#9333EA' }}>
                  <i className="bi bi-currency-rupee"></i>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: Dashboard with Chart & Pending Approvals matching Screen 8 */}
          {activeTab === 'dashboard' && (
            <>
              {/* 7-Day Orders Bar Chart Representation matching Screen 8 */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold text-dark m-0">Orders (Last 7 Days)</h6>
                  <span className="badge bg-light text-muted border">Daily Pre-Orders</span>
                </div>

                <div className="d-flex justify-content-between align-items-end" style={{ height: '140px', paddingBottom: '10px' }}>
                  {stats?.dailyOrderCounts?.map((item, idx) => {
                    const heightPercent = Math.min(100, Math.max(25, item.count * 4));
                    return (
                      <div key={idx} className="text-center flex-grow-1 d-flex flex-column align-items-center justify-content-end h-100">
                        <small className="text-muted fw-bold mb-1" style={{ fontSize: '0.75rem' }}>{item.count}</small>
                        <div
                          className="rounded-top w-50"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: '#0F766E',
                            transition: 'height 0.3s ease'
                          }}
                        ></div>
                        <small className="text-muted mt-2" style={{ fontSize: '0.75rem' }}>{item.date}</small>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pending Store Approvals Table matching Screen 8 */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark m-0">
                    Pending Store Approvals ({pendingStores.length})
                  </h6>
                  <button className="btn btn-sm btn-link text-success text-decoration-none fw-semibold" onClick={loadData}>
                    Refresh
                  </button>
                </div>

                {pendingStores.length === 0 ? (
                  <div className="alert alert-light border rounded-3 p-4 text-center text-muted small">
                    <i className="bi bi-check-circle text-success fs-4 d-block mb-1"></i>
                    All stores have been reviewed! No pending approvals at this time.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead className="table-light">
                        <tr className="small text-muted">
                          <th>Store Name</th>
                          <th>Owner</th>
                          <th>Locality & City</th>
                          <th>Submitted Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingStores.map((st) => (
                          <tr key={st.id} className="border-bottom">
                            <td className="fw-bold text-dark py-3">{st.storeName}</td>
                            <td>{st.ownerName || 'Shopkeeper'}</td>
                            <td>{st.locality}, {st.city}</td>
                            <td>
                              <span className="badge bg-warning-subtle text-warning-emphasis">
                                Pending Review
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-success rounded-pill px-3 me-2"
                                onClick={() => handleApproveStore(st.id, 'APPROVED')}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                onClick={() => handleApproveStore(st.id, 'REJECTED')}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: Users Management */}
          {activeTab === 'users' && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">User Accounts ({users.length})</h5>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr className="small text-muted">
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td className="fw-bold text-dark">{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.phoneNumber}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {u.role?.replace('ROLE_', '')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.active ? 'bg-success' : 'bg-danger'}`}>
                            {u.active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="text-end">
                          {u.role !== 'ROLE_ADMIN' && (
                            <button
                              className={`btn btn-sm rounded-pill px-3 ${u.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => handleToggleUserStatus(u.id)}
                            >
                              {u.active ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Stores Management */}
          {activeTab === 'stores' && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">All Stores ({stores.length})</h5>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr className="small text-muted">
                      <th>Store Name</th>
                      <th>Owner</th>
                      <th>City</th>
                      <th>Approval</th>
                      <th>Status</th>
                      <th className="text-end">Toggle Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((s) => (
                      <tr key={s.id}>
                        <td className="fw-bold text-dark">{s.storeName}</td>
                        <td>{s.ownerName}</td>
                        <td>{s.city}</td>
                        <td>
                          <span className={`badge ${s.approvalStatus === 'APPROVED' ? 'bg-success' : s.approvalStatus === 'PENDING' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {s.approvalStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${s.active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {s.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                            onClick={() => handleToggleStoreStatus(s.id)}
                          >
                            {s.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Categories Management */}
          {activeTab === 'categories' && (
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h6 className="fw-bold text-dark mb-3">Add Category</h6>
                  <form onSubmit={handleCreateCategory}>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Category Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={newCat.name}
                        onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                        placeholder="e.g. Beverages"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Icon Class</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newCat.iconName}
                        onChange={(e) => setNewCat({ ...newCat, iconName: e.target.value })}
                        placeholder="bi-tag"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        value={newCat.description}
                        onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-apnamart-primary w-100 rounded-pill btn-sm py-2">
                      Save Category
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h6 className="fw-bold text-dark mb-3">System Categories</h6>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr className="small text-muted">
                          <th>Name</th>
                          <th>Icon</th>
                          <th>Description</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c.id}>
                            <td className="fw-bold text-dark">{c.name}</td>
                            <td><i className={`bi ${c.iconName || 'bi-tag'} fs-5`}></i></td>
                            <td className="small text-muted">{c.description}</td>
                            <td>
                              <span className={`badge ${c.active ? 'bg-success' : 'bg-secondary'}`}>
                                {c.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Orders Audit */}
          {activeTab === 'orders' && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Platform Orders Audit ({allOrders.length})</h5>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr className="small text-muted">
                      <th>Order No.</th>
                      <th>Customer</th>
                      <th>Store</th>
                      <th>Pickup Slot</th>
                      <th>Status</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="fw-bold text-dark">#{o.orderNumber}</td>
                        <td>{o.customerName}</td>
                        <td>{o.storeName}</td>
                        <td className="small text-muted">{o.pickupDate} ({o.pickupTime})</td>
                        <td>
                          <span className="badge bg-light text-dark border">{o.orderStatus}</span>
                        </td>
                        <td className="text-end fw-bold text-dark">₹{o.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: Coupons & Platform Campaigns */}
          {activeTab === 'coupons' && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                  <h5 className="fw-bold text-dark mb-1">Promo Codes & Limited-Time Deals ({coupons.length})</h5>
                  <p className="text-muted small mb-0">
                    Manage global platform-wide coupons and store-specific promotional discount campaigns.
                  </p>
                </div>
                <button
                  className="btn btn-apnamart-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-2"
                  onClick={() => setShowCreateCouponModal(true)}
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  <span>+ Create Promo Code</span>
                </button>
              </div>

              {coupons.length === 0 ? (
                <div className="text-center py-5">
                  <div className="display-6 text-muted mb-3"><i className="bi bi-ticket-perforated"></i></div>
                  <h6 className="fw-bold text-muted">No coupons created yet</h6>
                  <p className="small text-muted mb-3">Launch a platform-wide or store-exclusive discount code to boost orders.</p>
                  <button className="btn btn-sm btn-outline-success rounded-pill" onClick={() => setShowCreateCouponModal(true)}>
                    + Create First Coupon
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-muted">
                        <th>Promo Code</th>
                        <th>Applicable Scope</th>
                        <th>Discount Value</th>
                        <th>Min Order</th>
                        <th>Max Cap</th>
                        <th>Used</th>
                        <th>Expiry</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-success-subtle text-success border border-success-subtle font-monospace px-2 py-1 fs-6">
                                {c.code}
                              </span>
                              {c.badge && (
                                <span className="badge bg-danger-subtle text-danger" style={{ fontSize: '0.7rem' }}>
                                  {c.badge}
                                </span>
                              )}
                            </div>
                            <div className="small fw-semibold text-dark mt-1">{c.title}</div>
                            {c.description && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{c.description}</div>}
                          </td>
                          <td>
                            {c.storeName ? (
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-shop me-1 text-primary"></i> {c.storeName}
                              </span>
                            ) : (
                              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                <i className="bi bi-globe2 me-1"></i> Platform Wide
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="fw-bold text-success">
                              {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                            </span>
                          </td>
                          <td className="small text-muted">
                            {c.minOrderAmount ? `₹${c.minOrderAmount}` : 'No Min'}
                          </td>
                          <td className="small text-muted">
                            {c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : 'Unlimited'}
                          </td>
                          <td className="small fw-bold">
                            {c.timesUsed || 0} {c.maxUses ? `/ ${c.maxUses}` : ''}
                          </td>
                          <td className="small">
                            {c.endDate ? (
                              <span className={new Date(c.endDate) < new Date() ? 'text-danger fw-bold' : 'text-muted'}>
                                {new Date(c.endDate).toLocaleDateString()} {new Date(c.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            ) : (
                              <span className="text-muted">No Expiry</span>
                            )}
                          </td>
                          <td>
                            <button
                              className={`badge border-0 ${c.active ? 'bg-success' : 'bg-secondary'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleToggleCoupon(c.id)}
                              title="Click to toggle active status"
                            >
                              {c.active ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                title="Toggle active status"
                                onClick={() => handleToggleCoupon(c.id)}
                              >
                                <i className={`bi ${c.active ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Delete Coupon"
                                onClick={() => handleDeleteCoupon(c.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Create Coupon Modal */}
          {showCreateCouponModal && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
              tabIndex="-1"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                  <div className="modal-header border-bottom px-4 pt-4 pb-3">
                    <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                      <i className="bi bi-ticket-perforated-fill text-success"></i>
                      <span>Create Platform / Store Promo Code</span>
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowCreateCouponModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleCreateCoupon}>
                    <div className="modal-body px-4 py-3">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold">Promo Code *</label>
                          <input
                            type="text"
                            className="form-control text-uppercase font-monospace"
                            placeholder="e.g. FESTIVE50"
                            required
                            value={couponForm.code}
                            onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                          />
                          <div className="form-text small">Must be uppercase without spaces.</div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-bold">Target Scope (Store / Global)</label>
                          <select
                            className="form-select"
                            value={couponForm.storeId}
                            onChange={(e) => setCouponForm({ ...couponForm, storeId: e.target.value })}
                          >
                            <option value="">🌐 Platform-Wide (All Stores & Kiranas)</option>
                            {stores.map((s) => (
                              <option key={s.id} value={s.id}>
                                🏬 {s.storeName} ({s.city || 'Store'})
                              </option>
                            ))}
                          </select>
                          <div className="form-text small">Apply to all stores on ApnaMart or restrict to one.</div>
                        </div>

                        <div className="col-md-8">
                          <label className="form-label small fw-bold">Offer Title *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Flat 50% Off on Groceries"
                            required
                            value={couponForm.title}
                            onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-bold">Offer Badge</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. ⚡ LIMITED TIME"
                            value={couponForm.badge}
                            onChange={(e) => setCouponForm({ ...couponForm, badge: e.target.value })}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-bold">Description / Terms</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            placeholder="e.g. Valid on order value above ₹199. Max discount ₹100."
                            value={couponForm.description}
                            onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                          ></textarea>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-bold">Discount Type *</label>
                          <select
                            className="form-select"
                            value={couponForm.discountType}
                            onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                          >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FLAT">Flat Amount (₹)</option>
                          </select>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-bold">
                            Discount Value ({couponForm.discountType === 'PERCENTAGE' ? '%' : '₹'}) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            className="form-control"
                            placeholder={couponForm.discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 50'}
                            required
                            value={couponForm.discountValue}
                            onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-bold">Minimum Order (₹)</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            placeholder="e.g. 199 (optional)"
                            value={couponForm.minOrderAmount}
                            onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-bold">Max Discount Cap (₹)</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            placeholder="e.g. 100 (for % discounts)"
                            value={couponForm.maxDiscountAmount}
                            onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: e.target.value })}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-bold">Expiry Date & Time (Limited-Time)</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={couponForm.endDate}
                            onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                          />
                          <div className="form-text small">Leave blank for perpetual / no expiry.</div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-top px-4 py-3 bg-light rounded-bottom-4">
                      <button
                        type="button"
                        className="btn btn-light rounded-pill px-3"
                        onClick={() => setShowCreateCouponModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-apnamart-primary rounded-pill px-4 shadow-sm"
                        disabled={couponSubmitting}
                      >
                        {couponSubmitting ? 'Creating...' : 'Create Promo Code'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}
