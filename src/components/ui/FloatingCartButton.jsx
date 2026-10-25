import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useEnquiryCart } from '../../context/EnquiryCartContext';

export function FloatingCartButton() {
  const { totalItemsCount } = useEnquiryCart();

  const accessibleLabel = totalItemsCount > 0
    ? `Open enquiry cart with ${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'}`
    : 'Open enquiry cart';

  return (
    <>
      <Link
        to="/enquiry"
        className="floating-cart-btn"
        aria-label={accessibleLabel}
        title={accessibleLabel}
      >
        <div className="floating-cart-inner">
          <ShoppingBag size={24} color="#ffffff" aria-hidden="true" />
          {totalItemsCount > 0 && (
            <span
              className="floating-cart-badge"
              aria-hidden="true"
            >
              {totalItemsCount > 99 ? '99+' : totalItemsCount}
            </span>
          )}
        </div>
      </Link>

      <style>{`
        .floating-cart-btn {
          display: none;
          position: fixed;
          bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
          right: calc(1.25rem + env(safe-area-inset-right, 0px));
          width: 58px;
          height: 58px;
          border-radius: var(--radius-full);
          background-color: var(--color-primary);
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.35), 0 2px 6px rgba(0, 0, 0, 0.15);
          align-items: center;
          justify-content: center;
          text-decoration: none;
          z-index: 45;
          transition: transform var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast);
          -webkit-tap-highlight-color: transparent;
        }

        .floating-cart-btn:hover {
          background-color: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(15, 23, 42, 0.4), 0 3px 8px rgba(0, 0, 0, 0.2);
        }

        .floating-cart-btn:active {
          transform: scale(0.93);
        }

        .floating-cart-btn:focus-visible {
          outline: 3px solid var(--color-accent);
          outline-offset: 3px;
        }

        .floating-cart-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .floating-cart-badge {
          position: absolute;
          top: 7px;
          right: 7px;
          transform: translate(25%, -25%);
          background-color: var(--color-accent);
          color: #ffffff;
          font-size: 0.725rem;
          font-weight: 700;
          min-width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          line-height: 1;
        }

        @media (max-width: 767px) {
          .floating-cart-btn {
            display: flex !important;
          }
        }

        @media (min-width: 768px) {
          .floating-cart-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
