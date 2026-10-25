import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { CataloguePage } from '../pages/public/CataloguePage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { EnquiryCartPage } from '../pages/public/EnquiryCartPage';
import { FavouritesPage } from '../pages/public/FavouritesPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Admin Pages
import { AdminDashboardPlaceholder } from '../pages/admin/AdminDashboardPlaceholder';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Storefront Route Tree */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<CataloguePage />} />
        <Route path="/categories/:slug" element={<CataloguePage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/search" element={<CataloguePage autoFocusSearch={true} />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/wishlist" element={<FavouritesPage />} />
        <Route path="/enquiry" element={<EnquiryCartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Route Tree (Architecture Shell for Phase 1) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPlaceholder />} />
        <Route path="*" element={<AdminDashboardPlaceholder />} />
      </Route>
    </Routes>
  );
}
