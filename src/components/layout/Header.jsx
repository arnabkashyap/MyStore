import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, PhoneCall, Layers } from 'lucide-react';
import { Container } from '../ui/Container';
import { useEnquiryCart } from '../../context/EnquiryCartContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount } = useEnquiryCart();

  // Sync mobile menu state with body class to prevent bottom dock overlap
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-drawer-open');
    } else {
      document.body.classList.remove('mobile-drawer-open');
    }
    return () => {
      document.body.classList.remove('mobile-drawer-open');
    };
  }, [mobileMenuOpen]);

  return (
    <header style={{
      backgroundColor: 'var(--color-bg-card)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <Container>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem',
          gap: 'var(--space-4)'
        }}>
          {/* Brand Logo & Title */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flex: 1,
              minWidth: 0,
              marginRight: 'var(--space-2)'
            }}
          >
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              minWidth: '2.5rem',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.25rem',
              fontFamily: 'var(--font-heading)',
              flexShrink: 0
            }}>
              B
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(0.95rem, 3.8vw, 1.15rem)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Baishya Furniture
              </div>
              <div style={{
                fontSize: 'clamp(0.68rem, 2.5vw, 0.75rem)',
                color: 'var(--color-accent)',
                fontWeight: 600,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                and Telectronics Showroom
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-6)'
            }}
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            <NavLink
              to="/"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                padding: '0.5rem 0'
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                padding: '0.5rem 0'
              })}
            >
              Catalogue
            </NavLink>
            <NavLink
              to="/categories/electronics"
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.95rem',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                padding: '0.5rem 0'
              })}
            >
              Electronics
            </NavLink>
            <NavLink
              to="/categories/wooden-furniture"
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.95rem',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                padding: '0.5rem 0'
              })}
            >
              Furniture
            </NavLink>
          </nav>

          {/* Action CTAs: Desktop Enquiry Cart & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
            <Link
              to="/enquiry"
              className="btn btn-outline btn-sm desktop-cart-btn"
              style={{ display: 'none', alignItems: 'center', gap: '0.45rem', position: 'relative' }}
              title="View your enquiry cart"
            >
              <ShoppingBag size={18} color="var(--color-primary)" />
              <span style={{ fontWeight: 600 }}>Enquiry Cart</span>
              {totalItemsCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    padding: '0.1rem 0.45rem',
                    lineHeight: 1.2,
                  }}
                  aria-label={`${totalItemsCount} items in enquiry cart`}
                >
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--color-text-primary)'
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            padding: 'var(--space-4) 0',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}>
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '0.5rem var(--space-2)',
                fontWeight: 600,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '0.5rem var(--space-2)',
                fontWeight: 600,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
              })}
            >
              All Catalogue Products
            </NavLink>
            <NavLink
              to="/favourites"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '0.5rem var(--space-2)',
                fontWeight: 600,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
              })}
            >
              Saved Favourites
            </NavLink>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              padding: '0.25rem var(--space-2)'
            }}>
              Showroom Categories
            </div>
            <NavLink
              to="/categories/electronics"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.35rem var(--space-4)', color: 'var(--color-text-secondary)' }}
            >
              • Electronics
            </NavLink>
            <NavLink
              to="/categories/mobile-phones"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.35rem var(--space-4)', color: 'var(--color-text-secondary)' }}
            >
              • Mobile Phones
            </NavLink>
            <NavLink
              to="/categories/steel-furniture"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.35rem var(--space-4)', color: 'var(--color-text-secondary)' }}
            >
              • Steel Furniture
            </NavLink>
            <NavLink
              to="/categories/wooden-furniture"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.35rem var(--space-4)', color: 'var(--color-text-secondary)' }}
            >
              • Wooden Furniture
            </NavLink>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  padding: '0.25rem var(--space-2)'
                }}
              >
                Showroom Admin Portal &rarr;
              </Link>
            </div>
          </div>
        )}
      </Container>

      {/* Responsive media style for desktop nav visibility */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cart-btn {
            display: inline-flex !important;
          }
          .mobile-toggle-btn {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-cart-btn {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
