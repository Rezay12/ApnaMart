import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="apnamart-footer">
      <div className="container">
        <div className="row gy-4">
          {/* Brand Column */}
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                background: 'linear-gradient(135deg, #F59E0B, #F97316)',
                borderRadius: 10, padding: '6px 9px', color: '#fff', fontSize: '1.1rem',
                boxShadow: '0 2px 8px rgba(245,158,11,0.4)'
              }}>
                <i className="bi bi-basket2-fill"></i>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.3px' }}>ApnaMart</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280 }}>
              Your Neighbourhood. Your Essentials. Hyperlocal Kirana and Department Store Pre-Ordering System.
            </p>
            <div className="d-flex gap-2 mt-3">
              {['bi-twitter-x', 'bi-instagram', 'bi-facebook', 'bi-linkedin'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                >
                  <i className={`bi ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2 offset-md-1">
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.85rem' }}>
              Quick Links
            </span>
            <Link to="/" className="footer-link"><i className="bi bi-house me-2"></i>Home</Link>
            <Link to="/stores" className="footer-link"><i className="bi bi-shop me-2"></i>Browse Stores</Link>
            <Link to="/login" className="footer-link"><i className="bi bi-person me-2"></i>Customer Login</Link>
            <Link to="/register" className="footer-link"><i className="bi bi-person-plus me-2"></i>Register</Link>
          </div>

          {/* For Business */}
          <div className="col-6 col-md-2">
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.85rem' }}>
              For Shopkeepers
            </span>
            <Link to="/register" className="footer-link"><i className="bi bi-shop-window me-2"></i>List Your Store</Link>
            <Link to="/login" className="footer-link"><i className="bi bi-speedometer2 me-2"></i>Shopkeeper Login</Link>
            <Link to="/login" className="footer-link"><i className="bi bi-shield-lock me-2"></i>Admin Portal</Link>
            <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noreferrer" className="footer-link" style={{ color: '#4ade80' }}>
              <i className="bi bi-code-square me-2"></i>API Docs
            </a>
          </div>

          {/* App Info */}
          <div className="col-md-3">
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.85rem' }}>
              Technology
            </span>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 2 }}>
              <div><i className="bi bi-cup-hot me-2" style={{ color: '#F59E0B' }}></i>Spring Boot 3.3 • Java 21</div>
              <div><i className="bi bi-lightning-charge me-2" style={{ color: '#61dafb' }}></i>React 18 • Vite</div>
              <div><i className="bi bi-shield-check me-2" style={{ color: '#4ade80' }}></i>Spring Security • JWT</div>
              <div><i className="bi bi-database me-2" style={{ color: '#f472b6' }}></i>MySQL 8.0</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0 1.5rem' }} />
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
            © {year} ApnaMart. Academic Full-Stack Web Development Project.
          </span>
          <div className="d-flex gap-3">
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>Built with ❤️ for local communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
