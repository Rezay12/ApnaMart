import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { storeApi } from '../api';

function StoreCardSkeleton() {
  return (
    <div className="col">
      <div className="store-card">
        <div className="skeleton" style={{ height: 180 }}></div>
        <div style={{ padding: '1rem' }}>
          <div className="skeleton skeleton-text mb-2" style={{ height: 16 }}></div>
          <div className="skeleton skeleton-text mb-3" style={{ height: 12, width: '70%' }}></div>
          <div className="d-flex justify-content-between">
            <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 20 }}></div>
            <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 20 }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoresListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryParam);

  const fetchStores = (q) => {
    setLoading(true);
    storeApi.getStores(q)
      .then((res) => { if (res.data) setStores(res.data); })
      .catch((err) => console.error('Error fetching stores:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStores(queryParam);
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchTerm.trim() ? { query: searchTerm.trim() } : {});
  };

  return (
    <div className="container py-4 animate-fade-in">
      {/* Page Hero */}
      <div className="page-hero mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="page-hero-title">
              <i className="bi bi-shop me-2 text-success"></i>
              Local Kirana &amp; Department Stores
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
              {stores.length > 0 ? `${stores.length} approved stores in your area` : 'Pre-order from approved neighbourhood shops'}
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: 380, width: '100%' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <i className="bi bi-search" style={{
                position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                color: '#94A3B8', fontSize: '0.9rem', pointerEvents: 'none'
              }}></i>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem', borderRadius: 12 }}
                placeholder="Search store or locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-apnamart-primary btn px-4" style={{ borderRadius: 12, whiteSpace: 'nowrap' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filter pills */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['All Stores', 'Kirana Store', 'Department Store', 'Open Now', 'Nearby'].map((f, i) => (
          <button
            key={f}
            type="button"
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 999,
              border: '1.5px solid',
              borderColor: i === 0 ? '#1B4D3E' : '#E2E8F0',
              background: i === 0 ? '#1B4D3E' : '#fff',
              color: i === 0 ? '#fff' : '#64748B',
              fontWeight: 600, fontSize: '0.82rem',
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.borderColor = '#1B4D3E'; e.currentTarget.style.color = '#1B4D3E'; }}}
            onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; }}}
          >
            {f}
          </button>
        ))}
        {queryParam && (
          <button
            type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.4rem 1rem', borderRadius: 999,
              border: '1.5px solid #fca5a5', background: '#fee2e2',
              color: '#dc2626', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
            }}
            onClick={() => { setSearchTerm(''); setSearchParams({}); }}
          >
            <i className="bi bi-x"></i> Clear: "{queryParam}"
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {[...Array(6)].map((_, i) => <StoreCardSkeleton key={i} />)}
        </div>
      ) : stores.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-shop" style={{ fontSize: '3.5rem', color: '#CBD5E1', display: 'block', marginBottom: '1rem' }}></i>
          <h5 style={{ fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>No stores found</h5>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', maxWidth: 320, margin: '0 auto 1.5rem' }}>
            Try searching for a different locality or store name.
          </p>
          <button
            className="btn-apnamart-outline btn px-4"
            onClick={() => { setSearchTerm(''); setSearchParams({}); }}
            id="clear-search-btn"
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>Clear Search
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {stores.map((store) => (
            <div className="col" key={store.id}>
              <Link to={`/stores/${store.id}`} className="store-card" style={{ textDecoration: 'none' }}>
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
                <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h5 style={{ fontWeight: 800, fontSize: '1rem', color: '#1E293B', margin: 0 }}>{store.storeName}</h5>
                      <span className="store-rating-badge">⭐ {store.rating || '4.5'}</span>
                    </div>
                    <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {store.description}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                      <i className="bi bi-clock me-1 text-success"></i>
                      {store.openingTime?.substring(0, 5)} – {store.closingTime?.substring(0, 5)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center" style={{ paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                    <span className="store-distance-badge">
                      <i className="bi bi-geo-alt"></i>
                      {store.distanceKm || '1.2'} km
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <i className="bi bi-geo"></i>
                      {store.locality}, {store.city}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
