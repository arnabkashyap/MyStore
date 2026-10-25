import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { ShieldCheck, Phone, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b',
      paddingTop: 'var(--space-12)',
      paddingBottom: 'var(--space-8)'
    }}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ marginBottom: 'var(--space-10)' }}>
          {/* Column 1: Showroom Brand & Concept */}
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: 'var(--space-3)' }}>
              Baishya Furniture and Telectronics
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              Physical showroom catalogue showcasing quality electronics, smartphones, steel furniture, and crafted wooden furniture.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#1e293b',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: '#cbd5e1'
            }}>
              <ShieldCheck size={16} color="#38bdf8" />
              <span>Enquiry-First Showroom Platform</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: 'var(--space-3)' }}>Showroom Catalogue</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/products" style={{ color: '#94a3b8' }}>All Products</Link>
              </li>
              <li>
                <Link to="/categories/electronics" style={{ color: '#94a3b8' }}>Electronics &amp; Appliances</Link>
              </li>
              <li>
                <Link to="/categories/mobile-phones" style={{ color: '#94a3b8' }}>Mobile Phones</Link>
              </li>
              <li>
                <Link to="/categories/steel-furniture" style={{ color: '#94a3b8' }}>Steel Almirahs &amp; Storage</Link>
              </li>
              <li>
                <Link to="/categories/wooden-furniture" style={{ color: '#94a3b8' }}>Wooden Furniture &amp; Sets</Link>
              </li>
              <li>
                <Link to="/enquiry" style={{ color: '#94a3b8' }}>My Enquiry Cart</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Showroom Notice & Contact Placeholder */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: 'var(--space-3)' }}>Showroom Inquiries</h4>
            <div style={{
              backgroundColor: '#1e293b',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <Info size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.825rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Showroom Verification Process
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Submitting an enquiry allows our showroom team to review availability and call you directly to discuss customization, delivery, and pricing.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                Official showroom phone numbers, physical address, and visiting hours will be published upon launch.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: 'var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Baishya Furniture and Telectronics. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Link to="/admin" style={{ color: '#64748b', fontSize: '0.8rem' }}>
              Admin Workspace
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
