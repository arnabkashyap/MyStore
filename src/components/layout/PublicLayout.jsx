import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavBar } from './BottomNavBar';
import { AlertCircle } from 'lucide-react';

export function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Development/Demo Notice Banner */}
      <div className="demo-banner">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertCircle size={15} />
          <span>
            <strong>Development Preview:</strong> Showroom catalogue items and prices shown below are sample mock data for demonstration.
          </span>
        </div>
      </div>

      <Header />

      <main style={{ flex: 1 }} className="public-main-content">
        <Outlet />
      </main>

      <Footer />

      {/* Persistent Glassmorphism Bottom Navigation Bar (Mobile only) */}
      <BottomNavBar />
    </div>
  );
}
