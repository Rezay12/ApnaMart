import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { storeApi, categoryApi, couponApi } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductSkeleton() {
  return (
    <div className="col">
      <div className="product-card" style={{ minHeight: 290 }}>
        <div className="skeleton" style={{ height: 180 }}></div>
        <div className="product-card-body">
          <div className="skeleton skeleton-text mb-1" style={{ height: 14 }}></div>
          <div className="skeleton skeleton-text" style={{ height: 14, width: '50%', marginBottom: 8 }}></div>
          <div className="skeleton" style={{ height: 36, borderRadius: 20, marginTop: 8 }}></div>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      background: '#fff', border: '1px solid #E2E8F0',
      borderRadius: 14, padding: '0.85rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 24px 48px rgba(0,0,0,0.14)', zIndex: 9999,
      animation: 'fade-in 0.3s ease', maxWidth: 360
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: '#dcfce7', color: '#059669',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', flexShrink: 0
      }}>
        <i className="bi bi-check-circle-fill"></i>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E293B' }}>Added to Cart!</div>
        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{message}</div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: 'auto', padding: 0 }}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}

function QuantityStepper({ qty, onDecrease, onIncrease, maxQty, loading }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      border: '2px solid #1B4D3E', borderRadius: 999,
      background: '#EBF5F0', overflow: 'hidden', width: '100%', height: 38,
    }}>
      <button type="button" onClick={onDecrease} disabled={loading} style={{
        width: 44, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', color: '#1B4D3E', cursor: 'pointer',
        fontSize: '1.15rem', fontWeight: 700, flexShrink: 0, opacity: loading ? 0.5 : 1,
      }}>
        <i className="bi bi-dash-lg"></i>
      </button>
      <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: '0.95rem', color: '#1B4D3E' }}>
        {loading ? <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14, borderWidth: 2 }}></span> : qty}
      </span>
      <button type="button" onClick={onIncrease} disabled={loading || qty >= maxQty} style={{
        width: 44, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#1B4D3E', border: 'none', color: '#fff', cursor: 'pointer',
        fontSize: '1.15rem', fontWeight: 700, flexShrink: 0,
        opacity: (loading || qty >= maxQty) ? 0.5 : 1, borderRadius: '0 999px 999px 0',
      }}>
        <i className="bi bi-plus-lg"></i>
      </button>
    </div>
  );
}

export default function StorePage() {
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const { addItem, updateQuantity, removeItem, cart } = useCart();
  const { isAuthenticated } = useAuth();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [sortBy, setSortBy] = useState('popularity');
  const [activeTab, setActiveTab] = useState('products');
  const [addingId, setAddingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [storeCoupons, setStoreCoupons] = useState([]);

  useEffect(() => {
    categoryApi.getCategories().then((res) => { if (res.data) setCategories(res.data); });
  }, []);

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    storeApi.getStoreById(storeId)
      .then((res) => setStore(res.data))
      .catch((err) => console.error('Error fetching store:', err));

    couponApi.getAvailableCoupons({ storeId })
      .then((res) => { if (res.data) setStoreCoupons(res.data); })
      .catch((err) => console.error('Error fetching store coupons:', err));

    let minPrice = null, maxPrice = null;
    if (selectedPriceRange === 'under50') { maxPrice = 50; }
    else if (selectedPriceRange === '50-100') { minPrice = 50; maxPrice = 100; }
    else if (selectedPriceRange === '100-200') { minPrice = 100; maxPrice = 200; }
    else if (selectedPriceRange === 'above200') { minPrice = 200; }

    storeApi.getStoreProducts(storeId, {
      categoryId: selectedCategory || null, minPrice, maxPrice, query: searchQuery || null
    })
      .then((res) => {
        if (res.data) {
          let sorted = [...res.data];
          if (sortBy === 'priceAsc') sorted.sort((a, b) => a.price - b.price);
          else if (sortBy === 'priceDesc') sorted.sort((a, b) => b.price - a.price);
          setProducts(sorted);
        }
      })
      .catch((err) => console.error('Error loading products:', err))
      .finally(() => setLoading(false));
  }, [storeId, selectedCategory, selectedPriceRange, searchQuery, sortBy]);

  const getCartItem = (productId) => {
    if (!cart?.items) return null;
    return cart.items.find((i) => i.productId === productId || i.product?.id === productId) || null;
  };

  const handleAddToCart = async (product) => {
    try {
      setAddingId(product.id);
      await addItem(product.id, 1);
      setToast(product.productName);
    } catch (err) { console.error(err); }
    finally { setAddingId(null); }
  };

  const handleIncrease = async (product) => {
    const ci = getCartItem(product.id);
    if (!ci) { await handleAddToCart(product); return; }
    try {
      setUpdatingId(product.id);
      await updateQuantity(ci.id, ci.quantity + 1);
    } catch (err) { console.error(err); }
    finally { setUpdatingId(null); }
  };

  const handleDecrease = async (product) => {
    const ci = getCartItem(product.id);
    if (!ci) return;
    try {
      setUpdatingId(product.id);
      if (ci.quantity <= 1) { await removeItem(ci.id); }
      else { await updateQuantity(ci.id, ci.quantity - 1); }
    } catch (err) { console.error(err); }
    finally { setUpdatingId(null); }
  };

  const dismissToast = useCallback(() => setToast(null), []);

  const PRICE_RANGES = [
    { value: '', label: 'All Prices' },
    { value: 'under50', label: 'Under Rs.50' },
    { value: '50-100', label: 'Rs.50 to Rs.100' },
    { value: '100-200', label: 'Rs.100 to Rs.200' },
    { value: 'above200', label: 'Above Rs.200' },
  ];

  return (
    <div className="container py-4 animate-fade-in">
      {toast && <Toast message={toast} onClose={dismissToast} />}
      {store && (
        <div className="store-banner mb-4">
          <div className="row g-0 align-items-stretch">
            <div className="col-md-3" style={{ minHeight: 170, overflow: 'hidden' }}>
              <img src={store.imageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'}
                alt={store.storeName} style={{ width: '100%', height: '100%', minHeight: 170, objectFit: 'cover', objectPosition: 'center' }} />
            </div>
            <div className="col-md-9 p-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div style={{ flex: 1 }}>
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h2 style={{ fontWeight: 800, fontSize: '1.35rem', color: '#1E293B', margin: 0 }}>{store.storeName}</h2>
                    <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 999, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>Approved</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span className="store-rating-badge">Rating: {store.rating || '4.5'} ({store.reviewCount || 124} reviews)</span>
                    <span className="store-distance-badge"><i className="bi bi-geo-alt"></i>{store.distanceKm || '1.2'} km</span>
                    <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 999, padding: '3px 10px', fontSize: '0.74rem', fontWeight: 600 }}>
                      Open: {store.openingTime?.substring(0, 5)} to {store.closingTime?.substring(0, 5)}
                    </span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '0.4rem' }}>{store.description}</p>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{store.address}, {store.locality}, {store.city}</div>
                </div>
                <Link to="/cart" className="btn-apnamart-outline btn" style={{ whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
                  <i className="bi bi-cart3"></i> View Cart
                  {cart?.totalItems > 0 && (
                    <span style={{ background: '#1B4D3E', color: '#fff', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px', marginLeft: 6 }}>{cart.totalItems}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Deals & Promo Codes Strip */}
      {storeCoupons.length > 0 && (
        <div className="store-offers-banner mb-4 p-3 rounded-4" style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          border: '1.5px solid #BBF7D0',
          boxShadow: '0 4px 15px rgba(21, 128, 61, 0.06)'
        }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success rounded-pill px-2 py-1" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-tag-fill me-1"></i>PROMO DEALS
              </span>
              <strong style={{ color: '#166534', fontSize: '0.9rem' }}>
                Active Deals & Limited-Time Offers for this store
              </strong>
            </div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Click code to copy</small>
          </div>

          <div className="d-flex gap-3 overflow-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
            {storeCoupons.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  setToast(`Copied promo code ${c.code} to clipboard!`);
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px dashed #16A34A',
                  borderRadius: 12,
                  padding: '8px 14px',
                  minWidth: 260,
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  flexShrink: 0
                }}
                className="hover-lift"
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontWeight: 800, color: '#15803D', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
                    {c.code}
                  </span>
                  {c.badge && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 999 }}>
                      {c.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.title}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-1" style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  <span>{c.minOrderAmount > 0 ? `Min ₹${c.minOrderAmount}` : 'No min order'}</span>
                  {c.timeRemainingFormatted && (
                    <span className="text-danger fw-semibold"><i className="bi bi-clock me-1"></i>{c.timeRemainingFormatted}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="premium-card mb-3" style={{ borderRadius: 16 }}>
            <div className="premium-card-header" style={{ padding: '0.85rem 1.1rem' }}>
              <span className="premium-card-title" style={{ fontSize: '0.875rem' }}><i className="bi bi-grid-3x3 me-2 text-success"></i>Categories</span>
            </div>
            <div style={{ padding: '0.5rem' }}>
              <button type="button" className={"filter-btn " + (selectedCategory === '' ? 'active' : '')} onClick={() => setSelectedCategory('')}><i className="bi bi-grid me-2"></i>All Categories</button>
              {categories.map((cat) => (
                <button key={cat.id} type="button" className={"filter-btn " + (String(selectedCategory) === String(cat.id) ? 'active' : '')} onClick={() => setSelectedCategory(cat.id)}>
                  <i className={"bi " + (cat.iconName || 'bi-tag') + " me-2"}></i>{cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="premium-card" style={{ borderRadius: 16 }}>
            <div className="premium-card-header" style={{ padding: '0.85rem 1.1rem' }}>
              <span className="premium-card-title" style={{ fontSize: '0.875rem' }}><i className="bi bi-currency-rupee me-2 text-success"></i>Price Range</span>
            </div>
            <div style={{ padding: '0.5rem' }}>
              {PRICE_RANGES.map((p) => (
                <button key={p.value} type="button" className={"filter-btn " + (selectedPriceRange === p.value ? 'active' : '')} onClick={() => setSelectedPriceRange(p.value)}>{p.label}</button>
              ))}
            </div>
          </div>
          {(selectedCategory || selectedPriceRange || searchQuery) && (
            <button type="button" className="btn btn-outline-secondary w-100 mt-3 rounded-pill py-2" style={{ fontSize: '0.82rem', fontWeight: 600 }}
              onClick={() => { setSelectedCategory(''); setSelectedPriceRange(''); setSearchQuery(''); }}>
              <i className="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
            </button>
          )}
        </div>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="d-flex gap-1" style={{ background: '#F1F5F9', borderRadius: 10, padding: 4 }}>
              <button className={"btn btn-sm rounded-3 fw-semibold px-3 " + (activeTab === 'products' ? 'bg-white shadow-sm text-success' : 'bg-transparent text-secondary border-0')}
                onClick={() => setActiveTab('products')} style={{ fontSize: '0.82rem', border: 'none', transition: 'all 0.2s' }}>
                <i className="bi bi-bag me-1"></i>Products ({products.length})
              </button>
              <button className={"btn btn-sm rounded-3 fw-semibold px-3 " + (activeTab === 'details' ? 'bg-white shadow-sm text-success' : 'bg-transparent text-secondary border-0')}
                onClick={() => setActiveTab('details')} style={{ fontSize: '0.82rem', border: 'none', transition: 'all 0.2s' }}>
                <i className="bi bi-info-circle me-1"></i>Store Info
              </button>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div style={{ position: 'relative', width: 200 }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.85rem', pointerEvents: 'none' }}></i>
                <input type="text" className="form-control form-control-sm" style={{ paddingLeft: '2rem', borderRadius: 10, fontSize: '0.82rem' }}
                  placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="form-select form-select-sm" style={{ width: 165, borderRadius: 10, fontSize: '0.82rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popularity">Sort: Popular</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {activeTab === 'products' ? (
            loading ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">{[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-basket" style={{ fontSize: '3rem', color: '#CBD5E1', display: 'block', marginBottom: '1rem' }}></i>
                <h5 style={{ fontWeight: 700, color: '#475569' }}>No products found</h5>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', maxWidth: 300, margin: '0 auto 1.5rem' }}>Try selecting another category or clearing your search filters.</p>
                <button className="btn-apnamart-outline btn px-4" onClick={() => { setSelectedCategory(''); setSelectedPriceRange(''); setSearchQuery(''); }}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
                </button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {products.map((product) => {
                  const ci = getCartItem(product.id);
                  const cartQty = ci ? ci.quantity : 0;
                  const inCart = cartQty > 0;
                  const isUpdating = updatingId === product.id;
                  const isAdding = addingId === product.id;

                  return (
                    <div className="col" key={product.id}>
                      <div className="product-card" style={{ position: 'relative' }}>
                        <div style={{ width: '100%', height: 180, overflow: 'hidden', background: '#F1F5F9', position: 'relative', flexShrink: 0, borderRadius: '16px 16px 0 0' }}>
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'}
                            alt={product.productName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'; }}
                          />
                          {inCart && (
                            <div style={{ position: 'absolute', top: 8, right: 8, background: '#1B4D3E', color: '#fff', borderRadius: 999, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
                              {cartQty} in cart
                            </div>
                          )}
                        </div>
                        <div className="product-card-body">
                          <h6 style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem', marginBottom: '0.35rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.productName}</h6>
                          <div className="d-flex align-items-baseline gap-1 mb-2">
                            <span className="product-price">Rs.{product.price}</span>
                            <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>/{product.unit}</span>
                          </div>
                          <div className="mb-3">
                            {product.availableQuantity > 10 ? (
                              <span className="stock-badge-in"><i className="bi bi-check-circle-fill"></i> In Stock ({product.availableQuantity})</span>
                            ) : product.availableQuantity > 0 ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#d97706', fontSize: '0.74rem', fontWeight: 600, background: '#fef3c7', padding: '2px 8px', borderRadius: 999 }}>
                                <i className="bi bi-exclamation-circle-fill"></i> Low Stock ({product.availableQuantity})
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626', fontSize: '0.74rem', fontWeight: 600, background: '#fee2e2', padding: '2px 8px', borderRadius: 999 }}>
                                <i className="bi bi-x-circle-fill"></i> Out of Stock
                              </span>
                            )}
                          </div>
                          {isAuthenticated ? (
                            inCart ? (
                              <QuantityStepper qty={cartQty} onDecrease={() => handleDecrease(product)} onIncrease={() => handleIncrease(product)} maxQty={product.availableQuantity} loading={isUpdating} />
                            ) : (
                              <button className="btn-apnamart-primary btn btn-sm w-100 rounded-pill py-2" onClick={() => handleAddToCart(product)} disabled={isAdding || product.availableQuantity <= 0} id={"add-to-cart-" + product.id}>
                                {isAdding ? <><span className="spinner-border spinner-border-sm me-1" role="status"></span>Adding...</> : <><i className="bi bi-cart-plus"></i> Add to Cart</>}
                              </button>
                            )
                          ) : (
                            <Link to="/login" className="btn-apnamart-outline btn btn-sm w-100 rounded-pill py-2 text-center" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                              <i className="bi bi-box-arrow-in-right"></i>Login to Order
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="premium-card animate-fade-in">
              <div className="premium-card-header"><span className="premium-card-title">About {store?.storeName}</span></div>
              <div className="premium-card-body">
                <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>{store?.description}</p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="bi bi-clock text-success"></i> Store Timings</div>
                      <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>Opens: <strong>{store?.openingTime}</strong> | Closes: <strong>{store?.closingTime}</strong></p>
                      <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0.35rem 0 0' }}>Pre-orders accepted throughout the day</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="bi bi-geo-alt text-success"></i> Pickup Address</div>
                      <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>{store?.address}</p>
                      <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{store?.locality}, {store?.city} ({store?.postalCode})</p>
                      {store?.phoneNumber && <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0.35rem 0 0' }}><i className="bi bi-telephone me-1"></i>{store?.phoneNumber}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
