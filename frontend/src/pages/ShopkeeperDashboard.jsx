import React, { useEffect, useState } from 'react';
import { shopkeeperApi, categoryApi, couponApi } from '../api';
import { useAuth } from '../context/AuthContext';
import SellerPackingModal from '../components/SellerPackingModal';

export default function ShopkeeperDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'store', 'slots', 'coupons'
  const [dashboardStats, setDashboardStats] = useState(null);
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [couponSubmitting, setCouponSubmitting] = useState(false);
  const [selectedOrderForPacking, setSelectedOrderForPacking] = useState(null);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [products, setProducts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const [couponForm, setCouponForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    endDate: '',
    badge: '⭐ STORE EXCLUSIVE',
  });

  // Forms state
  const [newProduct, setNewProduct] = useState({
    productName: '',
    categoryId: '',
    price: '',
    availableQuantity: '',
    unit: 'kg',
    description: '',
    imageUrl: '',
  });

  const [newSlot, setNewSlot] = useState({
    pickupDate: '',
    startTime: '09:00',
    endTime: '10:00',
    capacity: 10,
  });

  const [storeForm, setStoreForm] = useState({
    storeName: '',
    description: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    openingTime: '08:00',
    closingTime: '21:30',
    imageUrl: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      shopkeeperApi.getDashboard(),
      shopkeeperApi.getStore().catch(() => ({ data: null })),
      shopkeeperApi.getOrders(),
      shopkeeperApi.getProducts().catch(() => ({ data: [] })),
      shopkeeperApi.getPickupSlots().catch(() => ({ data: [] })),
      categoryApi.getCategories(),
      couponApi.getAllCoupons().catch(() => ({ data: [] })),
    ])
      .then(([dashRes, storeRes, ordersRes, prodRes, slotsRes, catRes, couponRes]) => {
        if (dashRes.data) setDashboardStats(dashRes.data);
        if (storeRes.data) {
          setStore(storeRes.data);
          setStoreForm({
            storeName: storeRes.data.storeName || '',
            description: storeRes.data.description || '',
            address: storeRes.data.address || '',
            locality: storeRes.data.locality || '',
            city: storeRes.data.city || '',
            state: storeRes.data.state || '',
            postalCode: storeRes.data.postalCode || '',
            phoneNumber: storeRes.data.phoneNumber || '',
            openingTime: storeRes.data.openingTime ? storeRes.data.openingTime.substring(0, 5) : '08:00',
            closingTime: storeRes.data.closingTime ? storeRes.data.closingTime.substring(0, 5) : '21:30',
            imageUrl: storeRes.data.imageUrl || '',
          });
          // Filter coupons for this store
          if (couponRes.data) {
            setCoupons(couponRes.data.filter((c) => c.storeId === storeRes.data.id || c.storeId == null));
          }
        } else if (couponRes.data) {
          setCoupons(couponRes.data);
        }
        if (ordersRes.data) setOrders(ordersRes.data);
        if (prodRes.data) setProducts(prodRes.data);
        if (slotsRes.data) setSlots(slotsRes.data);
        if (catRes.data) {
          setCategories(catRes.data);
          if (catRes.data.length > 0) {
            setNewProduct((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
          }
        }
      })
      .catch((err) => console.error('Error loading shopkeeper dashboard:', err))
      .finally(() => setLoading(false));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.title || !couponForm.discountValue) {
      setActionMsg('Please fill in required coupon fields (Code, Title, Discount Value)');
      return;
    }

    try {
      setCouponSubmitting(true);
      const payload = {
        code: couponForm.code.trim().toUpperCase(),
        title: couponForm.title.trim(),
        description: couponForm.description?.trim() || null,
        discountType: couponForm.discountType,
        discountValue: parseFloat(couponForm.discountValue),
        minOrderAmount: couponForm.minOrderAmount ? parseFloat(couponForm.minOrderAmount) : 0,
        maxDiscountAmount: couponForm.maxDiscountAmount ? parseFloat(couponForm.maxDiscountAmount) : null,
        endDate: couponForm.endDate ? couponForm.endDate + ':00' : null,
        badge: couponForm.badge || '⭐ STORE EXCLUSIVE',
        storeId: store?.id || null,
        active: true,
      };

      await couponApi.createCoupon(payload);
      setActionMsg(`Promo code ${payload.code} created successfully!`);
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
        badge: '⭐ STORE EXCLUSIVE',
      });
      loadData();
    } catch (err) {
      setActionMsg(err.message || 'Failed to create coupon.');
    } finally {
      setCouponSubmitting(false);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await couponApi.toggleCouponStatus(id);
      setActionMsg('Coupon status updated!');
      loadData();
    } catch (err) {
      setActionMsg(err.message || 'Failed to update coupon status.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotional coupon?')) return;
    try {
      await couponApi.deleteCoupon(id);
      setActionMsg('Coupon removed successfully.');
      loadData();
    } catch (err) {
      setActionMsg(err.message || 'Failed to delete coupon.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await shopkeeperApi.updateOrderStatus(orderId, newStatus);
      setActionMsg(`Order status updated to ${newStatus}`);
      loadData();
      if (selectedOrderForPacking && selectedOrderForPacking.id === orderId) {
        setSelectedOrderForPacking(res.data);
      }
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await shopkeeperApi.addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        availableQuantity: parseInt(newProduct.availableQuantity, 10),
      });
      setActionMsg('Product added successfully!');
      setNewProduct({
        productName: '',
        categoryId: categories[0]?.id || '',
        price: '',
        availableQuantity: '',
        unit: 'kg',
        description: '',
        imageUrl: '',
      });
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product? It will be soft-deleted to keep past order history accurate.')) {
      return;
    }
    try {
      await shopkeeperApi.deleteProduct(id);
      setActionMsg('Product removed successfully.');
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to remove product');
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await shopkeeperApi.createPickupSlot({
        ...newSlot,
        capacity: parseInt(newSlot.capacity, 10),
      });
      setActionMsg('Pickup slot added successfully!');
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to create pickup slot');
    }
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    try {
      await shopkeeperApi.updateStore(storeForm);
      setActionMsg('Store details saved successfully!');
      loadData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update store profile');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-pending">Pending</span>;
      case 'ACCEPTED': return <span className="badge badge-accepted">Accepted</span>;
      case 'READY_FOR_PICKUP': return <span className="badge badge-ready">Ready for Pickup</span>;
      case 'COMPLETED': return <span className="badge badge-completed">Completed</span>;
      case 'CANCELLED':
      case 'REJECTED': return <span className="badge badge-cancelled">{status}</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Shopkeeper Sidebar */}
      <aside className="dashboard-sidebar">
          <div className="sidebar-profile-card">
            <div className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
              <i className="bi bi-shop fs-5"></i>
            </div>
            <div>
              <div className="fw-bold text-white small">{user?.fullName || 'Shopkeeper'}</div>
              <small className="text-white-50">Shopkeeper</small>
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
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'orders' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="bi bi-receipt"></i> Orders ({orders.length})
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'products' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('products')}
            >
              <i className="bi bi-box-seam"></i> Products ({products.length})
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'slots' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('slots')}
            >
              <i className="bi bi-calendar3"></i> Pickup Slots
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'store' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('store')}
            >
              <i className="bi bi-shop-window"></i> Store Profile
            </button>
            <button
              className={`sidebar-nav-link border-0 text-start w-100 ${activeTab === 'coupons' ? 'active' : 'bg-transparent'}`}
              onClick={() => setActiveTab('coupons')}
            >
              <i className="bi bi-tag-fill text-warning"></i> Coupons & Offers ({coupons.length})
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

          {/* Store Overview Banner matching Screen 7 */}
          {store ? (
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white d-flex flex-row align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={store.imageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'}
                  alt={store.storeName}
                  style={{ width: '84px', height: '64px', objectFit: 'cover' }}
                  className="rounded-3"
                />
                <div>
                  <h4 className="fw-bold text-dark m-0">{store.storeName}</h4>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      <i className="bi bi-check-circle-fill me-1"></i> {store.approvalStatus} • {store.active ? 'Active' : 'Inactive'}
                    </span>
                    <small className="text-muted"><i className="bi bi-geo-alt me-1"></i>{store.locality}, {store.city}</small>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => setActiveTab('store')}>
                  Edit Profile
                </button>
                <button className="btn btn-sm btn-apnamart-primary rounded-pill px-3" onClick={() => setActiveTab('products')}>
                  + Add Product
                </button>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning rounded-4 shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-1">Store Profile Setup Required</h5>
              <p className="small mb-3">You haven't set up your kirana store profile yet. Complete registration to receive customer orders.</p>
              <button className="btn btn-warning rounded-pill px-4 fw-bold" onClick={() => setActiveTab('store')}>
                Setup Store Now
              </button>
            </div>
          )}

          {/* 4 Stat Cards matching Screen 7 */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-number">{dashboardStats?.totalOrders ?? orders.length}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>
                  <i className="bi bi-clipboard2-check"></i>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Pending Orders</div>
                  <div className="stat-number text-warning">{dashboardStats?.pendingOrders ?? 0}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  <i className="bi bi-hourglass-split"></i>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Sales</div>
                  <div className="stat-number text-success">₹{dashboardStats?.totalSales ?? 0}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                  <i className="bi bi-currency-rupee"></i>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Products</div>
                  <div className="stat-number">{dashboardStats?.totalProducts ?? products.length}</div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: '#F3E8FF', color: '#9333EA' }}>
                  <i className="bi bi-box-seam"></i>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: Dashboard / Orders matching Screen 7 */}
          {(activeTab === 'dashboard' || activeTab === 'orders') && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold text-dark m-0">Incoming Customer Orders</h5>
                  <small className="text-muted">Review goods requested, check off items, and update fulfillment stage.</small>
                </div>
                <button className="btn btn-sm btn-link text-success text-decoration-none fw-semibold" onClick={loadData}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </button>
              </div>

              {/* Order Status Filter Pills */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${orderFilter === 'ALL' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setOrderFilter('ALL')}
                >
                  All Orders ({orders.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${orderFilter === 'PENDING' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
                  onClick={() => setOrderFilter('PENDING')}
                >
                  <i className="bi bi-bell-fill me-1"></i>
                  New Pending ({orders.filter((o) => o.orderStatus === 'PENDING').length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${orderFilter === 'ACCEPTED' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setOrderFilter('ACCEPTED')}
                >
                  <i className="bi bi-box-seam me-1"></i>
                  Packing ({orders.filter((o) => o.orderStatus === 'ACCEPTED').length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${orderFilter === 'READY_FOR_PICKUP' ? 'btn-info text-white' : 'btn-outline-info'}`}
                  onClick={() => setOrderFilter('READY_FOR_PICKUP')}
                >
                  <i className="bi bi-bag-check me-1"></i>
                  Ready for Pickup ({orders.filter((o) => o.orderStatus === 'READY_FOR_PICKUP').length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${orderFilter === 'COMPLETED' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setOrderFilter('COMPLETED')}
                >
                  <i className="bi bi-check2-all me-1"></i>
                  Completed ({orders.filter((o) => o.orderStatus === 'COMPLETED').length})
                </button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status"></div>
                </div>
              ) : orders.filter((o) => orderFilter === 'ALL' || o.orderStatus === orderFilter).length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox text-muted display-4 mb-2"></i>
                  <p className="text-muted small">No orders matching this filter.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-muted">
                        <th>Order No.</th>
                        <th>Customer</th>
                        <th style={{ minWidth: '220px' }}>Goods Ordered</th>
                        <th>Pickup Slot</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th className="text-end">Manage & Pack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter((o) => orderFilter === 'ALL' || o.orderStatus === orderFilter)
                        .map((order) => (
                          <tr key={order.id} className="border-bottom">
                            <td className="fw-bold text-dark py-3">
                              #{order.orderNumber}
                            </td>
                            <td>
                              <div className="fw-semibold text-dark small">{order.customerName}</div>
                              <small className="text-muted">{order.customerPhone}</small>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1 mb-1" style={{ maxWidth: '280px' }}>
                                {order.items?.map((it) => (
                                  <span key={it.id} className="badge bg-light text-dark border px-2 py-1 fw-normal" style={{ fontSize: '0.75rem' }}>
                                    <span className="fw-bold text-success me-1">{it.quantity}x</span>
                                    {it.productName}
                                  </span>
                                ))}
                              </div>
                              {order.customerNote && (
                                <div className="text-warning-emphasis small fst-italic" style={{ fontSize: '0.72rem' }}>
                                  <i className="bi bi-chat-quote-fill me-1"></i>"{order.customerNote}"
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="small fw-semibold">{order.pickupDate}</div>
                              <small className="text-muted">{order.pickupTime}</small>
                            </td>
                            <td>
                              {getStatusBadge(order.orderStatus)}
                            </td>
                            <td className="fw-bold text-dark">
                              ₹{order.totalAmount}
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end align-items-center gap-1 flex-wrap">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold shadow-sm"
                                  onClick={() => setSelectedOrderForPacking(order)}
                                  title="View full goods checklist & pack"
                                >
                                  <i className="bi bi-box2-fill me-1"></i> View Goods & Pack
                                </button>

                                {order.orderStatus === 'PENDING' && (
                                  <button
                                    className="btn btn-sm btn-success rounded-pill px-3"
                                    onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                                  >
                                    Accept
                                  </button>
                                )}

                                {order.orderStatus === 'ACCEPTED' && (
                                  <button
                                    className="btn btn-sm btn-primary rounded-pill px-3"
                                    onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                                  >
                                    Mark Ready
                                  </button>
                                )}

                                {order.orderStatus === 'READY_FOR_PICKUP' && (
                                  <button
                                    className="btn btn-sm btn-success rounded-pill px-3"
                                    onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                  >
                                    Completed
                                  </button>
                                )}
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

          {/* TAB 2: Products Catalog Management */}
          {activeTab === 'products' && (
            <div className="row g-4 mb-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
                  <h5 className="fw-bold text-dark mb-3">Add New Product</h5>
                  <form onSubmit={handleAddProduct}>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Product Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={newProduct.productName}
                        onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                        placeholder="e.g. Fresh Tomatoes"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select form-select-sm"
                        required
                        value={newProduct.categoryId}
                        onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control form-control-sm"
                          required
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="40"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Unit</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                          placeholder="kg, pack, litre"
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Available Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        required
                        value={newProduct.availableQuantity}
                        onChange={(e) => setNewProduct({ ...newProduct, availableQuantity: e.target.value })}
                        placeholder="50"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Image URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-apnamart-primary w-100 rounded-pill btn-sm py-2 fw-semibold">
                      Save Product
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">Store Products ({products.length})</h5>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr className="small text-muted">
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={p.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'}
                                  alt={p.productName}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded border"
                                />
                                <span className="fw-semibold text-dark small">{p.productName}</span>
                              </div>
                            </td>
                            <td className="small text-muted">{p.categoryName}</td>
                            <td className="fw-bold text-dark">₹{p.price}/{p.unit}</td>
                            <td>
                              <span className={`badge ${p.availableQuantity > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                {p.availableQuantity} {p.unit}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${p.active ? 'bg-success' : 'bg-secondary'}`}>
                                {p.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-danger border-0"
                                onClick={() => handleDeleteProduct(p.id)}
                                title="Remove / Inactivate product"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
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

          {/* TAB 3: Pickup Slots Management */}
          {activeTab === 'slots' && (
            <div className="row g-4 mb-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">Add Pickup Slot</h5>
                  <form onSubmit={handleCreateSlot}>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Pickup Date</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        required
                        value={newSlot.pickupDate}
                        onChange={(e) => setNewSlot({ ...newSlot, pickupDate: e.target.value })}
                      />
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Start Time</label>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          required
                          value={newSlot.startTime}
                          onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">End Time</label>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          required
                          value={newSlot.endTime}
                          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Capacity (Max orders)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        required
                        min="1"
                        value={newSlot.capacity}
                        onChange={(e) => setNewSlot({ ...newSlot, capacity: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-apnamart-primary w-100 rounded-pill btn-sm py-2">
                      Create Slot
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">Store Pickup Slots</h5>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr className="small text-muted">
                          <th>Date</th>
                          <th>Time</th>
                          <th>Capacity</th>
                          <th>Reserved</th>
                          <th>Spots Left</th>
                          <th className="text-end">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slots.map((s) => (
                          <tr key={s.id}>
                            <td className="fw-semibold text-dark">{s.pickupDate}</td>
                            <td>{s.startTime?.substring(0, 5)} - {s.endTime?.substring(0, 5)}</td>
                            <td>{s.capacity}</td>
                            <td>{s.reservedCount}</td>
                            <td>
                              <span className="badge bg-success-subtle text-success border border-success-subtle">
                                {s.availableSpots} available
                              </span>
                            </td>
                            <td className="text-end">
                              <span className={`badge ${s.available ? 'bg-success' : 'bg-danger'}`}>
                                {s.available ? 'Active' : 'Full'}
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

          {/* TAB 4: Store Profile Management */}
          {activeTab === 'store' && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4" style={{ maxWidth: '750px' }}>
              <h5 className="fw-bold text-dark mb-3">Store Profile & Operating Timings</h5>
              <form onSubmit={handleSaveStore}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Store Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={storeForm.storeName}
                      onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Store Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={storeForm.phoneNumber}
                      onChange={(e) => setStoreForm({ ...storeForm, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={storeForm.description}
                      onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Address Line</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={storeForm.address}
                      onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Locality</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={storeForm.locality}
                      onChange={(e) => setStoreForm({ ...storeForm, locality: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={storeForm.city}
                      onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">State</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={storeForm.state}
                      onChange={(e) => setStoreForm({ ...storeForm, state: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={storeForm.postalCode}
                      onChange={(e) => setStoreForm({ ...storeForm, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Opening Time</label>
                    <input
                      type="time"
                      className="form-control"
                      required
                      value={storeForm.openingTime}
                      onChange={(e) => setStoreForm({ ...storeForm, openingTime: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Closing Time</label>
                    <input
                      type="time"
                      className="form-control"
                      required
                      value={storeForm.closingTime}
                      onChange={(e) => setStoreForm({ ...storeForm, closingTime: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Store Banner Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={storeForm.imageUrl}
                      onChange={(e) => setStoreForm({ ...storeForm, imageUrl: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-apnamart-primary rounded-pill px-4 mt-4">
                  Save Store Profile
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: Coupons & Offers Management */}
          {activeTab === 'coupons' && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold text-dark m-0">Store Coupons & Limited-Time Offers</h5>
                  <small className="text-muted">
                    Create promo codes and time-bound discounts to boost pre-orders for {store?.storeName || 'your store'}.
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-apnamart-primary rounded-pill px-4 fw-bold"
                    onClick={() => setShowCreateCouponModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Create Promo Code
                  </button>
                  <button className="btn btn-outline-secondary rounded-pill px-3" onClick={loadData}>
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>

              {coupons.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', fontSize: '1.8rem', color: '#94A3B8'
                  }}>
                    <i className="bi bi-tag"></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">No Promo Codes Created Yet</h6>
                  <p className="text-muted small mb-3" style={{ maxWidth: 360, margin: '0 auto' }}>
                    Create your first discount coupon to reward loyal neighborhood customers and drive more store pickups.
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-success rounded-pill px-4 fw-bold"
                    onClick={() => setShowCreateCouponModal(true)}
                  >
                    + Create First Coupon
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-muted">
                        <th>Promo Code</th>
                        <th>Offer Title</th>
                        <th>Discount</th>
                        <th>Min Order</th>
                        <th>Expiry / Time Remaining</th>
                        <th className="text-center">Times Used</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => (
                        <tr key={coupon.id} className="border-bottom">
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{
                                border: '1.5px dashed #059669',
                                background: '#ECFDF5',
                                color: '#065F46',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                padding: '3px 8px',
                                borderRadius: 6,
                                letterSpacing: '0.05em'
                              }}>
                                {coupon.code}
                              </span>
                            </div>
                            {coupon.badge && (
                              <span className="badge mt-1" style={{ fontSize: '0.65rem', background: '#FEF3C7', color: '#92400E' }}>
                                {coupon.badge}
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="fw-semibold text-dark small">{coupon.title}</div>
                            {coupon.description && (
                              <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: 220 }}>
                                {coupon.description}
                              </small>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success border border-success-subtle fw-bold">
                              {coupon.discountType === 'PERCENTAGE'
                                ? `${coupon.discountValue}% OFF`
                                : `₹${coupon.discountValue} FLAT`}
                            </span>
                            {coupon.maxDiscountAmount && (
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                Max ₹{coupon.maxDiscountAmount}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="small text-dark fw-semibold">
                              {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : 'None'}
                            </span>
                          </td>
                          <td>
                            {coupon.timeRemainingFormatted ? (
                              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle" style={{ fontSize: '0.72rem' }}>
                                <i className="bi bi-clock me-1"></i>{coupon.timeRemainingFormatted}
                              </span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.72rem' }}>No Expiry</span>
                            )}
                          </td>
                          <td className="text-center">
                            <span className="badge bg-light text-dark border fw-bold px-2 py-1">
                              {coupon.timesUsed || 0}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${coupon.active ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.72rem' }}>
                              {coupon.active ? 'Active' : 'Paused'}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <button
                                type="button"
                                className={`btn btn-sm ${coupon.active ? 'btn-outline-secondary' : 'btn-outline-success'} rounded-pill px-2 py-1`}
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => handleToggleCoupon(coupon.id)}
                                title={coupon.active ? 'Pause Coupon' : 'Activate Coupon'}
                              >
                                <i className={`bi ${coupon.active ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                title="Delete Coupon"
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
        </main>

      {/* Create Coupon Modal */}
      {showCreateCouponModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 540,
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-tag-fill text-success fs-5"></i>
                <h5 className="m-0 fw-bold text-dark">Create Store Promo Code</h5>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateCouponModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#94A3B8' }}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ padding: '1.5rem' }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Promo Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. FLASH20"
                    required
                    style={{ textTransform: 'uppercase', fontWeight: 700 }}
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Badge Highlight</label>
                  <select
                    className="form-select"
                    value={couponForm.badge}
                    onChange={(e) => setCouponForm({ ...couponForm, badge: e.target.value })}
                  >
                    <option value="⭐ STORE EXCLUSIVE">⭐ STORE EXCLUSIVE</option>
                    <option value="⚡ 24H FLASH SALE">⚡ 24H FLASH SALE</option>
                    <option value="⚡ 48H DEAL">⚡ 48H DEAL</option>
                    <option value="🎉 FESTIVE OFFER">🎉 FESTIVE OFFER</option>
                    <option value="🥬 FRESH DEALS">🥬 FRESH DEALS</option>
                    <option value="🏷️ MEGA SAVER">🏷️ MEGA SAVER</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Offer Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 20% OFF on Kirana Pre-Orders"
                    required
                    value={couponForm.title}
                    onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="e.g. Save 20% on groceries and dairy above ₹250. Collect at store counter with zero queue!"
                    value={couponForm.description}
                    onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Discount Type *</label>
                  <select
                    className="form-select"
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    {couponForm.discountType === 'PERCENTAGE' ? 'Discount % *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="form-control"
                    placeholder={couponForm.discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 50'}
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 250"
                    value={couponForm.minOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 100 (for % discounts)"
                    disabled={couponForm.discountType === 'FLAT'}
                    value={couponForm.maxDiscountAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Offer Expiry Date & Time (Optional)</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={couponForm.endDate}
                    onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                  />
                  <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Leave blank for continuous offers, or select date/time for limited-time flash deals.
                  </small>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setShowCreateCouponModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-apnamart-primary rounded-pill px-4 fw-bold"
                  disabled={couponSubmitting}
                >
                  {couponSubmitting ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Creating...</span>
                  ) : (
                    'Publish Offer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seller Packing Slip & Verification Modal */}
      {selectedOrderForPacking && (
        <SellerPackingModal
          order={selectedOrderForPacking}
          onClose={() => setSelectedOrderForPacking(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
