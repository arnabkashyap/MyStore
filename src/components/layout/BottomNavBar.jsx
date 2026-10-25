import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Search, Heart, ShoppingBag } from 'lucide-react';
import { useEnquiryCart } from '../../context/EnquiryCartContext';
import { useFavourites } from '../../context/FavouritesContext';

export function BottomNavBar() {
  const location = useLocation();
  const { totalItemsCount } = useEnquiryCart();
  const { favouritesCount } = useFavourites();

  const pathname = location.pathname;
  const searchParam = location.search;

  // Active state conditions matching the 4 primary storefront destinations
  const isHomeActive = pathname === '/';
  const isSearchActive = pathname === '/products' || pathname === '/search' || pathname.startsWith('/categories/');
  const isFavouriteActive = pathname === '/favourites' || pathname === '/wishlist';
  const isCartActive = pathname === '/enquiry';

  // Smoothly focuses catalogue search input when clicking Search
  const handleSearchClick = () => {
    setTimeout(() => {
      const input = document.querySelector('input[aria-label="Search showroom products"]');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  return (
    <>
      <nav
        className="glass-bottom-nav"
        aria-label="Mobile Navigation Dock"
        role="navigation"
      >
        {/* 1. Home */}
        <Link
          to="/"
          className={`glass-nav-item ${isHomeActive ? 'active' : ''}`}
          aria-label="Showroom homepage"
          aria-current={isHomeActive ? 'page' : undefined}
        >
          <div className="glass-nav-icon-wrapper">
            <House
              size={21}
              strokeWidth={isHomeActive ? 2.4 : 1.9}
              aria-hidden="true"
            />
          </div>
          <span className="glass-nav-label">Home</span>
          {isHomeActive && <span className="glass-nav-active-indicator" aria-hidden="true" />}
        </Link>

        {/* 2. Search */}
        <Link
          to="/products?search=focus"
          onClick={handleSearchClick}
          className={`glass-nav-item ${isSearchActive ? 'active' : ''}`}
          aria-label="Search showroom catalogue"
          aria-current={isSearchActive ? 'page' : undefined}
        >
          <div className="glass-nav-icon-wrapper">
            <Search
              size={21}
              strokeWidth={isSearchActive ? 2.4 : 1.9}
              aria-hidden="true"
            />
          </div>
          <span className="glass-nav-label">Search</span>
          {isSearchActive && <span className="glass-nav-active-indicator" aria-hidden="true" />}
        </Link>

        {/* 3. Favourites */}
        <Link
          to="/favourites"
          className={`glass-nav-item ${isFavouriteActive ? 'active' : ''}`}
          aria-label={favouritesCount > 0 ? `Saved favourites, ${favouritesCount} items` : 'Saved favourites'}
          aria-current={isFavouriteActive ? 'page' : undefined}
        >
          <div className="glass-nav-icon-wrapper">
            <Heart
              size={21}
              strokeWidth={isFavouriteActive ? 2.4 : 1.9}
              fill={isFavouriteActive ? 'currentColor' : (favouritesCount > 0 ? 'rgba(225, 29, 72, 0.15)' : 'none')}
              aria-hidden="true"
            />
            {favouritesCount > 0 && (
              <span className="glass-nav-badge favourites-badge" aria-hidden="true">
                {favouritesCount > 99 ? '99+' : favouritesCount}
              </span>
            )}
          </div>
          <span className="glass-nav-label">Favourites</span>
          {isFavouriteActive && <span className="glass-nav-active-indicator" aria-hidden="true" />}
        </Link>

        {/* 4. Cart */}
        <Link
          to="/enquiry"
          className={`glass-nav-item ${isCartActive ? 'active' : ''}`}
          aria-label={totalItemsCount > 0 ? `Showroom enquiry cart, ${totalItemsCount} items` : 'Showroom enquiry cart'}
          aria-current={isCartActive ? 'page' : undefined}
        >
          <div className="glass-nav-icon-wrapper">
            <ShoppingBag
              size={21}
              strokeWidth={isCartActive ? 2.4 : 1.9}
              aria-hidden="true"
            />
            {totalItemsCount > 0 && (
              <span className="glass-nav-badge cart-badge" aria-hidden="true">
                {totalItemsCount > 99 ? '99+' : totalItemsCount}
              </span>
            )}
          </div>
          <span className="glass-nav-label">Cart</span>
          {isCartActive && <span className="glass-nav-active-indicator" aria-hidden="true" />}
        </Link>
      </nav>

      <style>{`
        .glass-bottom-nav {
          display: none;
          position: fixed;
          bottom: calc(0.85rem + env(safe-area-inset-bottom, 0px));
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 1.5rem);
          max-width: 420px;
          height: 60px;
          background: rgba(255, 255, 255, 0.78);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow:
            0 10px 30px -5px rgba(15, 23, 42, 0.16),
            0 4px 12px rgba(15, 23, 42, 0.08),
            inset 0 1px 1px rgba(255, 255, 255, 0.9);
          border-radius: 26px;
          z-index: 50;
          align-items: center;
          justify-content: space-around;
          padding: 0 0.35rem;
          box-sizing: border-box;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: transform var(--transition-normal), opacity var(--transition-normal);
        }

        /* Prevent bottom dock from overlapping mobile navigation drawer */
        body.mobile-drawer-open .glass-bottom-nav {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: translateX(-50%) translateY(24px) !important;
        }

        .glass-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 50px;
          min-width: 48px;
          border-radius: 18px;
          text-decoration: none;
          color: var(--color-text-secondary);
          transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);
          padding: 0.2rem 0.15rem;
          position: relative;
        }

        .glass-nav-item:hover {
          color: var(--color-primary);
          background: rgba(30, 58, 138, 0.04);
        }

        .glass-nav-item:active {
          transform: scale(0.93);
        }

        .glass-nav-item:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .glass-nav-item.active {
          color: var(--color-primary);
          background: rgba(30, 58, 138, 0.08);
          box-shadow: inset 0 0 0 1px rgba(30, 58, 138, 0.12);
        }

        .glass-nav-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 24px;
        }

        .glass-nav-label {
          font-size: 0.6875rem;
          font-weight: 600;
          line-height: 1.1;
          margin-top: 2px;
          letter-spacing: 0.01em;
          transition: color var(--transition-fast);
        }

        .glass-nav-item.active .glass-nav-label {
          font-weight: 700;
          color: var(--color-primary);
        }

        /* Restrained showroom accent indicator under active destination */
        .glass-nav-active-indicator {
          position: absolute;
          bottom: 3px;
          width: 14px;
          height: 2.5px;
          border-radius: var(--radius-full);
          background-color: var(--color-accent);
          transition: width var(--transition-fast);
        }

        .glass-nav-badge {
          position: absolute;
          top: -4px;
          right: -9px;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 17px;
          height: 17px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 1.5px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.22);
          line-height: 1;
        }

        .glass-nav-badge.cart-badge {
          background-color: var(--color-accent);
        }

        .glass-nav-badge.favourites-badge {
          background-color: #e11d48;
        }

        /* Show on mobile viewports only, below 768px */
        @media (max-width: 767px) {
          .glass-bottom-nav {
            display: flex !important;
          }
        }

        @media (min-width: 768px) {
          .glass-bottom-nav {
            display: none !important;
          }
        }

        /* Mobile Viewport Width Optimizations (320px, 375px, 390px, 430px) */
        @media (max-width: 360px) {
          .glass-bottom-nav {
            width: calc(100% - 1rem);
            height: 56px;
            padding: 0 0.15rem;
            border-radius: 22px;
          }
          .glass-nav-label {
            font-size: 0.625rem;
          }
          .glass-nav-item {
            height: 46px;
            min-width: 44px;
          }
        }

        @media (min-width: 361px) and (max-width: 400px) {
          .glass-bottom-nav {
            width: calc(100% - 1.5rem);
          }
        }

        @media (min-width: 401px) and (max-width: 767px) {
          .glass-bottom-nav {
            width: calc(100% - 2rem);
          }
        }

        /* Reduced-motion accessibility preference */
        @media (prefers-reduced-motion: reduce) {
          .glass-bottom-nav,
          .glass-nav-item,
          .glass-nav-item *,
          .glass-nav-active-indicator {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
          body.mobile-drawer-open .glass-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default BottomNavBar;
