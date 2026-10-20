import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BENEFITS_CUSTOMER = [
  { icon: 'bi-cart-check', text: 'Pre-order from local stores' },
  { icon: 'bi-alarm', text: 'Book convenient pickup slots' },
  { icon: 'bi-bag-check', text: 'Zero queue, packed & ready' },
];

const BENEFITS_SHOPKEEPER = [
  { icon: 'bi-graph-up', text: 'Manage orders digitally' },
  { icon: 'bi-boxes', text: 'Live inventory tracking' },
  { icon: 'bi-people', text: 'Grow neighbourhood reach' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'ROLE_CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isShopkeeper = formData.role === 'ROLE_SHOPKEEPER';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const registered = await register(formData);
      if (registered.role === 'ROLE_SHOPKEEPER') navigate('/shopkeeper/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = isShopkeeper ? BENEFITS_SHOPKEEPER : BENEFITS_CUSTOMER;

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card animate-fade-in" style={{ maxWidth: 520 }}>
        {/* Header */}
        <div className="auth-card-header">
          <div className="auth-logo-icon">
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <h1 className="auth-card-title">Join ApnaMart</h1>
          <p className="auth-card-subtitle">Your neighbourhood commerce network</p>
        </div>

        {/* Role Selector — top of body */}
        <div style={{ padding: '1.25rem 2rem 0' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { role: 'ROLE_CUSTOMER', label: 'Customer', icon: 'bi-cart', desc: 'Browse & pre-order' },
              { role: 'ROLE_SHOPKEEPER', label: 'Shopkeeper', icon: 'bi-shop-window', desc: 'Manage my store' }
            ].map(opt => (
              <button
                key={opt.role}
                type="button"
                onClick={() => setFormData({ ...formData, role: opt.role })}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: 14,
                  border: `2px solid ${formData.role === opt.role ? '#1B4D3E' : '#E2E8F0'}`,
                  background: formData.role === opt.role ? 'linear-gradient(135deg, #EBF5F0, #dcfce7)' : '#fff',
                  color: formData.role === opt.role ? '#1B4D3E' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'center',
                }}
              >
                <i className={`bi ${opt.icon} d-block mb-1`} style={{ fontSize: '1.4rem', color: formData.role === opt.role ? '#1B4D3E' : '#94A3B8' }}></i>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{opt.label}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{opt.desc}</div>
              </button>
            ))}
          </div>

          {/* Benefits */}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748B' }}>
                <i className={`bi ${b.icon}`} style={{ color: '#1B4D3E' }}></i>
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="auth-card-body" style={{ paddingTop: '1rem' }}>
          {errorMsg && (
            <div className="alert d-flex align-items-center gap-2 py-2 px-3 mb-3 rounded-3"
              style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '0.85rem' }}>
              <i className="bi bi-x-circle-fill"></i>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" htmlFor="reg-name">
                  <i className="bi bi-person me-1 text-muted"></i> Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  className="form-control"
                  required
                  placeholder={isShopkeeper ? 'e.g. Vikram Singh' : 'e.g. Rahul Sharma'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ borderRadius: 12 }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="reg-email">
                  <i className="bi bi-envelope me-1 text-muted"></i> Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ borderRadius: 12 }}
                  autoComplete="email"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="reg-phone">
                  <i className="bi bi-phone me-1 text-muted"></i> Phone Number
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  className="form-control"
                  required
                  placeholder="98XXXXXXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  style={{ borderRadius: 12 }}
                />
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="reg-password">
                  <i className="bi bi-lock me-1 text-muted"></i> Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    required
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ borderRadius: 12, paddingRight: '3rem' }}
                    autoComplete="new-password"
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
                {formData.password && (
                  <div style={{ marginTop: '0.4rem', display: 'flex', gap: '4px' }}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: formData.password.length > i * 2
                          ? (formData.password.length < 6 ? '#FCA5A5' : formData.password.length < 10 ? '#FDE68A' : '#86EFAC')
                          : '#E2E8F0',
                        transition: 'background 0.3s'
                      }}></div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isShopkeeper && (
              <div style={{
                marginTop: '1rem', padding: '0.85rem 1rem', background: '#EFF6FF',
                border: '1px solid #BFDBFE', borderRadius: 12,
                fontSize: '0.8rem', color: '#1E40AF'
              }}>
                <i className="bi bi-info-circle me-2"></i>
                Your store will require admin approval before going live on the platform.
              </div>
            )}

            <button
              type="submit"
              className="btn-apnamart-primary btn w-100 py-2 fw-bold mt-3"
              disabled={loading}
              style={{ borderRadius: 12, fontSize: '0.95rem' }}
              id="register-btn"
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
              ) : (
                <><i className="bi bi-person-check me-2"></i>Create {isShopkeeper ? 'Shopkeeper' : 'Customer'} Account</>
              )}
            </button>
          </form>

          <div className="text-center mt-3" style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#1B4D3E' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
