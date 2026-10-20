import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'rahul@apnamart.com', password: 'Customer@123', icon: 'bi-person-circle', color: '#15803d', bg: '#dcfce7' },
  { label: 'Shopkeeper', email: 'vikram@apnamart.com', password: 'Shop@123', icon: 'bi-shop', color: '#1e40af', bg: '#dbeafe' },
  { label: 'Admin', email: 'admin@apnamart.com', password: 'Admin@123', icon: 'bi-shield-check', color: '#7e22ce', bg: '#f3e8ff' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);

  const expired = new URLSearchParams(location.search).get('expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const loggedIn = await login(email, password);
      if (loggedIn.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (loggedIn.role === 'ROLE_SHOPKEEPER') navigate('/shopkeeper/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc, idx) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setActiveDemo(idx);
    setErrorMsg('');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card animate-fade-in">
        {/* Header */}
        <div className="auth-card-header">
          <div className="auth-logo-icon">
            <i className="bi bi-basket2-fill"></i>
          </div>
          <h1 className="auth-card-title">Welcome Back</h1>
          <p className="auth-card-subtitle">Sign in to your ApnaMart account</p>
        </div>

        {/* Body */}
        <div className="auth-card-body">
          {expired && (
            <div className="alert d-flex align-items-center gap-2 py-2 px-3 mb-3 rounded-3"
              style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              Your session expired. Please sign in again.
            </div>
          )}

          {errorMsg && (
            <div className="alert d-flex align-items-center gap-2 py-2 px-3 mb-3 rounded-3"
              style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '0.85rem' }}>
              <i className="bi bi-x-circle-fill"></i>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-email">
                <i className="bi bi-envelope me-1 text-muted"></i> Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: 12, padding: '0.7rem 1rem' }}
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0" htmlFor="login-password">
                  <i className="bi bi-lock me-1 text-muted"></i> Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: 12, padding: '0.7rem 3rem 0.7rem 1rem' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0
                  }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-apnamart-primary btn w-100 py-2 fw-bold mb-4"
              disabled={loading}
              style={{ borderRadius: 12, fontSize: '0.95rem' }}
              id="sign-in-btn"
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div style={{
            background: 'linear-gradient(135deg, #F8FAFC, #EBF5F0)',
            border: '1px solid #E2E8F0',
            borderRadius: 14,
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>
              ⚡ Quick Demo Access
            </div>
            <div className="d-flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => fillDemo(acc, i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 999,
                    border: `1.5px solid ${activeDemo === i ? acc.color : '#E2E8F0'}`,
                    background: activeDemo === i ? acc.bg : '#fff',
                    color: activeDemo === i ? acc.color : '#475569',
                    fontWeight: 600, fontSize: '0.8rem',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <i className={`bi ${acc.icon}`}></i> {acc.label}
                  {activeDemo === i && <i className="bi bi-check-circle-fill" style={{ marginLeft: 2, fontSize: '0.75rem' }}></i>}
                </button>
              ))}
            </div>
            {activeDemo !== null && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                <i className="bi bi-info-circle me-1"></i>
                Credentials filled — click Sign In to continue
              </div>
            )}
          </div>

          {/* Register link */}
          <div className="text-center" style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" className="fw-bold text-decoration-none" style={{ color: '#1B4D3E' }}>
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
