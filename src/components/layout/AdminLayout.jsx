import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { ShieldAlert, ArrowLeft, Database } from 'lucide-react';

export function AdminLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Explicit Architecture & Security Notice */}
      <div style={{
        backgroundColor: '#7f1d1d',
        color: '#fef2f2',
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        textAlign: 'center',
        fontWeight: 500
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={16} color="#fca5a5" />
          <span>
            <strong>Admin Workspace Architecture Shell:</strong> Real administrative permissions and Row Level Security policies will be established in Phase 2 &amp; Phase 5 via Supabase. No fake auth or client-only security is simulated here.
          </span>
        </div>
      </div>

      {/* Admin Top Navigation */}
      <header style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '1rem 0',
        borderBottom: '1px solid #334155'
      }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                ADMIN SHELL
              </div>
              <h1 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                Baishya Furniture and Telectronics — Admin Shell
              </h1>
            </div>
            <div>
              <Link
                to="/"
                style={{
                  color: '#94a3b8',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} /> Return to Public Storefront
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Admin Content */}
      <main style={{ flex: 1, padding: 'var(--space-8) 0' }}>
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Admin Footer */}
      <footer style={{
        padding: '1rem 0',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#64748b',
        borderTop: '1px solid #cbd5e1',
        backgroundColor: '#e2e8f0'
      }}>
        <Container>
          Baishya Furniture and Telectronics &bull; Private Administrative System Shell (Phase 1 Foundation)
        </Container>
      </footer>
    </div>
  );
}
