import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storeApi, categoryApi, couponApi } from '../api';

const CATEGORY_ICONS = {
  'Fruits & Vegetables': null, // uses emoji instead
  'Dairy & Eggs': 'bi-egg-fried',
  'Snacks & Beverages': 'bi-cup-straw',
  'Household': 'bi-house-heart',
  'Personal Care': 'bi-bag-heart',
  'Grains & Pulses': 'bi-grid-3x3',
};

const CATEGORY_EMOJI = {
  'Fruits & Vegetables': '🥦',
};

const CATEGORY_COLORS = [
  { bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', color: '#15803d' },
  { bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', color: '#1e40af' },
  { bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)', color: '#9d174d' },
  { bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92400e' },
  { bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', color: '#6d28d9' },
  { bg: 'linear-gradient(135deg,#ffedd5,#fed7aa)', color: '#c2410c' },
];

function StoreSkeleton() {
  return (
    <div className="col">
      <div className="store-card" style={{ border: '1px solid #E2E8F0' }}>
        <div className="skeleton" style={{ height: '180px' }}></div>
        <div style={{ padding: '1.1rem' }}>
          <div className="skeleton skeleton-text mb-2"></div>
          <div className="skeleton skeleton-text short"></div>
          <div className="d-flex justify-content-between mt-3">
            <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 20 }}></div>
            <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 20 }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storeApi.getStores(),
      categoryApi.getCategories(),
      couponApi.getAvailableCoupons(),
    ])
      .then(([storesRes, catRes, couponRes]) => {
        if (storesRes.data) setStores(storesRes.data);
        if (catRes.data) setCategories(catRes.data);
        if (couponRes.data) setDeals(couponRes.data);
      })
      .catch((err) => console.error('Error loading home data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-3 animate-fade-in">

      {/* ── Hero Section ── */}
      <section className="hero-section mb-5">
        {/* Animated blobs */}
        <div className="hero-blob-1"></div>
        <div className="hero-blob-2"></div>

        <div className="row align-items-center w-100 g-4" style={{ position: 'relative', zIndex: 2 }}>
          <div className="col-lg-7 hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Hyperlocal Kirana Pre-Ordering — Now Live
            </div>

            <h1 className="hero-title">
              Fresh Groceries,<br />
              <span className="highlight">Local Stores,</span><br />
              Pre-Order & Pickup
            </h1>

            <p className="hero-subtitle">
              Skip the queue. Browse your neighbourhood kirana stores, pre-order essentials, and collect at your chosen time slot.
            </p>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <Link to="/stores" className="btn-apnamart-primary btn btn-lg">
                <i className="bi bi-geo-alt-fill"></i>
                Shop Nearby
              </Link>
              <Link to="/register" className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold">
                Get Started
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <span className="hero-stat-num">{stores.length || '4'}+</span>
                <span className="hero-stat-lbl">Local Stores</span>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }}></div>
              <div>
                <span className="hero-stat-num">{categories.length || '6'}+</span>
                <span className="hero-stat-lbl">Categories</span>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }}></div>
              <div>
                <span className="hero-stat-num">0</span>
                <span className="hero-stat-lbl">Queue Time</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                alt="Fresh Groceries from Local Kirana Store"
                className="hero-img"
              />
              <div className="hero-float-badge hero-float-badge-1">
                <span style={{ fontSize: '1.2rem' }}>🛒</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1B4D3E' }}>Just Pre-Ordered!</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Sharma Kirana Store</div>
                </div>
              </div>
              <div className="hero-float-badge hero-float-badge-2">
                <span style={{ fontSize: '1.2rem' }}>⏰</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1B4D3E' }}>Slot Booked</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Pick up 10–11 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Row ── */}
      <section className="mb-5">
        <div className="row g-3">
          {[
            { icon: 'bi-search-heart', title: 'Browse Local Stores', desc: 'Find approved neighbourhood kirana and department stores near you.', color: '#dcfce7', iconColor: '#15803d' },
            { icon: 'bi-cart-check', title: 'Pre-Order Easily', desc: 'Add products to your cart and pre-order from any one nearby store.', color: '#dbeafe', iconColor: '#1e40af' },
            { icon: 'bi-alarm', title: 'Choose Pickup Slot', desc: 'Pick your preferred time slot. Your order will be packed and ready.', color: '#fce7f3', iconColor: '#9d174d' },
            { icon: 'bi-bag-check', title: 'Collect & Go', desc: 'Walk in, collect your packed order. No queues, no waiting.', color: '#fef3c7', iconColor: '#92400e' },
          ].map((f, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="premium-card h-100 text-center p-3" style={{ transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: f.color, color: f.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', margin: '0 auto 0.75rem'
                }}>
                  <i className={`bi ${f.icon}`}></i>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', marginBottom: '0.3rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Limited-Time Deals & Promo Codes Showcase ── */}
      {deals.length > 0 && (
        <section className="mb-5">
          <div className="section-header">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-danger rounded-pill px-2 py-1" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-lightning-charge-fill me-1"></i>LIMITED TIME
                </span>
                <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 700 }}>Exclusive Kirana Offers</span>
              </div>
              <h2 className="section-title">Deals, Coupons & Special Offers</h2>
              <p className="mb-0" style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                Save big on grocery pre-orders with verified discount coupons
              </p>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-3 g-3">
            {deals.slice(0, 3).map((deal) => (
              <div className="col" key={deal.id}>
                <div
                  className="premium-card p-3 h-100 position-relative"
                  style={{
                    border: '1.5px solid #E2E8F0',
                    borderRadius: 16,
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{
                      border: '1.5px dashed #059669',
                      background: '#ECFDF5',
                      color: '#065F46',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      padding: '4px 10px',
                      borderRadius: 8,
                      letterSpacing: '0.05em'
                    }}>
                      {deal.code}
                    </span>
                    {deal.badge && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 999,
                        background: deal.badge.includes('FLASH') ? '#FEF2F2' : '#EFF6FF',
                        color: deal.badge.includes('FLASH') ? '#DC2626' : '#2563EB',
                        border: `1px solid ${deal.badge.includes('FLASH') ? '#FECACA' : '#BFDBFE'}`
                      }}>
                        {deal.badge}
                      </span>
                    )}
                  </div>

                  <h5 style={{ fontWeight: 800, color: '#1E293B', fontSize: '1rem', marginBottom: 4 }}>
                    {deal.title}
                  </h5>
                  <p style={{ color: '#64748B', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {deal.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto" style={{ fontSize: '0.75rem' }}>
                    <span className="text-muted fw-semibold">
                      {deal.minOrderAmount > 0 ? `Min. Cart: ₹${deal.minOrderAmount}` : 'No minimum order'}
                    </span>
                    {deal.timeRemainingFormatted && (
                      <span style={{ color: '#D97706', fontWeight: 700 }}>
                        <i className="bi bi-clock me-1"></i>{deal.timeRemainingFormatted}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success flex-grow-1 fw-bold rounded-pill"
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => {
                        navigator.clipboard.writeText(deal.code);
                        setCopiedCode(deal.code);
                        setTimeout(() => setCopiedCode(null), 2500);
                      }}
                    >
                      {copiedCode === deal.code ? (
                        <span><i className="bi bi-check-circle-fill me-1"></i>Copied!</span>
                      ) : (
                        <span><i className="bi bi-copy me-1"></i>Copy Code</span>
                      )}
                    </button>
                    <Link
                      to={deal.storeId ? `/stores/${deal.storeId}` : '/stores'}
                      className="btn btn-sm btn-apnamart-primary rounded-pill px-3 fw-bold text-decoration-none"
                      style={{ fontSize: '0.78rem' }}
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Shop by Category ── */}
      <section className="mb-5">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="mb-0" style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
              Explore essentials across all departments
            </p>
          </div>
          <Link to="/stores" className="view-all-link">
            View All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-3">
            {[...Array(6)].map((_, i) => (
              <div className="col" key={i}>
                <div className="category-card-circle" style={{ minHeight: 130 }}>
                  <div className="skeleton" style={{ width: 58, height: 58, borderRadius: '50%', marginBottom: 12 }}></div>
                  <div className="skeleton skeleton-text" style={{ width: 70 }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-3">
            {categories.map((cat, i) => (
              <div className="col" key={cat.id}>
                <Link to={`/stores?categoryId=${cat.id}`} className="category-card-circle" style={{ height: '100%' }}>
                  <div className="category-icon-wrapper" style={{
                    background: CATEGORY_COLORS[i % CATEGORY_COLORS.length].bg,
                    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length].color,
                  }}>
                    {CATEGORY_EMOJI[cat.name] ? (
                      <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{CATEGORY_EMOJI[cat.name]}</span>
                    ) : (
                      <i className={`bi ${CATEGORY_ICONS[cat.name] || cat.iconName || 'bi-bag'}`}></i>
                    )}
                  </div>
                  <h6 className="category-title">{cat.name}</h6>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Stores ── */}
      <section className="mb-5">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Stores</h2>
            <p className="mb-0" style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
              Approved neighbourhood kirana & department stores
            </p>
          </div>
          <Link to="/stores" className="view-all-link">
            View All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[...Array(3)].map((_, i) => <StoreSkeleton key={i} />)}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {stores.map((store) => (
              <div className="col" key={store.id}>
                <Link to={`/stores/${store.id}`} className="store-card">
                  <div className="store-card-img-wrapper">
                    <img
                      src={store.imageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'}
                      alt={store.storeName}
                      className="store-card-img"
                    />
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 60%)'
                    }}></div>
                    <span className="store-status-badge">● Open</span>
                  </div>
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h5 style={{ fontWeight: 800, fontSize: '1rem', color: '#1E293B', margin: 0 }}>{store.storeName}</h5>
                        <span className="store-rating-badge">⭐ {store.rating || '4.5'}</span>
                      </div>
                      <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {store.description}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center" style={{ paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                      <span className="store-distance-badge">
                        <i className="bi bi-geo-alt"></i>
                        {store.distanceKm || '1.2'} km
                      </span>
                      <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                        <i className="bi bi-clock me-1"></i>
                        {store.openingTime?.substring(0, 5)} – {store.closingTime?.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── App Download / CTA Banner ── */}
      <section className="mb-4">
        <div style={{
          background: 'linear-gradient(135deg, #0d2b22 0%, #1a5c3e 50%, #0f7f56 100%)',
          borderRadius: 24,
          padding: '3rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.14)',
        }}>
          <div style={{
            position: 'absolute', width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            right: -80, top: -100,
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 999, padding: '0.3rem 0.85rem', fontSize: '0.78rem',
              fontWeight: 700, color: '#86efac', marginBottom: '0.75rem', letterSpacing: '0.04em'
            }}>
              🏪 FOR SHOPKEEPERS
            </div>
            <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.65rem', letterSpacing: '-0.5px', margin: '0 0 0.5rem' }}>
              Own a Kirana Store?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: 0, maxWidth: 440 }}>
              Join ApnaMart and start receiving pre-orders from your neighbourhood. Manage inventory, slots, and orders — all in one place.
            </p>
          </div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-amber btn">
              <i className="bi bi-shop-window"></i>
              Register Your Store
            </Link>
            <Link to="/login" className="btn btn-outline-light rounded-pill px-4 fw-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
