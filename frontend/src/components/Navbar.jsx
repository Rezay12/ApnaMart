import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, isCustomer, isShopkeeper, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/stores?query=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isShopkeeper) return '/shopkeeper/dashboard';
    return '/customer/dashboard';
  };

  const getRoleBadgeClass = () => {
    if (isAdmin) return 'role-badge-admin';
    if (isShopkeeper) return 'role-badge-shopkeeper';
    return 'role-badge-customer';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar navbar-expand-lg apnamart-navbar sticky-top" id="main-navbar">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand brand-logo">
          <span className="logo-icon"><i className="bi bi-basket2-fill"></i></span>
          <span>ApnaMart</span>
        </Link>

        {/* Global Search Bar — Desktop */}
        <form className="d-none d-md-flex search-bar-wrapper mx-lg-4 flex-grow-1" onSubmit={handleSearch}>
          <i className="bi bi-search search-icon"></i>
          <input
            type="search"
            className="search-bar-input"
            placeholder="Search products, groceries or stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Right Actions */}
        <div className="d-flex align-items-center gap-2">
          {/* Desktop nav links */}
          <Link to="/" className="text-white text-decoration-none d-none d-lg-block fw-500 px-2 py-1 rounded-pill" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.8) !important' }}>
            Home
          </Link>
          <Link to="/stores" className="text-white text-decoration-none d-none d-lg-block fw-500 px-2 py-1 rounded-pill me-1" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Stores
          </Link>

          {/* My Orders */}
          {isAuthenticated && isCustomer && (
            <Link
              to="/customer/orders"
              className="btn btn-outline-light rounded-pill px-3 py-1 d-flex align-items-center gap-1"
              style={{ fontSize: '0.875rem', fontWeight: 600 }}
              id="nav-my-orders-btn"
            >
              <i className="bi bi-bag-check" style={{ color: '#FCD34D' }}></i>
              <span className="d-none d-sm-inline">My Orders</span>
            </Link>
          )}

          {/* Cart */}
          {(!isAuthenticated || isCustomer) && (
            <Link to="/cart" className="btn btn-outline-light position-relative rounded-pill px-3 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              <i className="bi bi-cart3"></i>
              <span className="d-none d-sm-inline">Cart</span>
              {totalItems > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{ top: 2, right: -4, fontSize: '0.65rem', minWidth: 18, padding: '2px 5px' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Auth State */}
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center gap-2 rounded-pill px-2 py-1"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="user-menu-btn"
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B, #F97316)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.72rem', color: '#fff', flexShrink: 0
                }}>
                  {getInitials(user?.fullName)}
                </div>
                <span className="d-none d-md-inline">{user?.fullName?.split(' ')[0] || 'Account'}</span>
                <i className="bi bi-chevron-down" style={{ fontSize: '0.7rem', opacity: 0.7 }}></i>
              </button>

              <ul className="dropdown-menu dropdown-menu-end border-0 mt-2 py-1" style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.15)', borderRadius: 14, minWidth: 220 }}>
                {/* Profile header */}
                <li className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F59E0B, #F97316)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.9rem', color: '#fff', flexShrink: 0
                    }}>
                      {getInitials(user?.fullName)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.875rem' }}>{user?.fullName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{user?.email}</div>
                      <span className={`badge mt-1 ${getRoleBadgeClass()}`} style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20 }}>
                        {user?.role?.replace('ROLE_', '')}
                      </span>
                    </div>
                  </div>
                </li>

                <li>
                  <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to={getDashboardLink()} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    <i className="bi bi-speedometer2 text-primary"></i> Dashboard
                  </Link>
                </li>
                {isCustomer && (
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/customer/orders" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      <i className="bi bi-bag-check text-success"></i> My Orders
                    </Link>
                  </li>
                )}
                {isCustomer && (
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/cart" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      <i className="bi bi-cart3" style={{ color: '#F59E0B' }}></i> My Cart
                    </Link>
                  </li>
                )}
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button
                    className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger"
                    onClick={logout}
                    style={{ fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login"
                className="btn btn-outline-light rounded-pill px-3 py-1 fw-semibold"
                style={{ fontSize: '0.875rem' }}
              >
                Sign In
              </Link>
              <Link to="/register"
                className="btn rounded-pill px-3 py-1 fw-semibold d-none d-md-inline-flex align-items-center"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', color: '#fff', fontSize: '0.875rem', border: 'none', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="d-md-none w-100 px-3 pb-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <form className="search-bar-wrapper mt-2 w-100" onSubmit={handleSearch}>
          <i className="bi bi-search search-icon"></i>
          <input
            type="search"
            className="search-bar-input"
            placeholder="Search stores or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </form>
      </div>
    </nav>
  );
}
