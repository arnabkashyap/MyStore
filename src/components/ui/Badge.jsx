import React from 'react';

/**
 * Availability Status Badges
 * Supported statuses:
 * - 'available' -> Available
 * - 'out_of_stock' -> Out of stock
 * - 'available_on_order' -> Available on order
 * - 'coming_soon' -> Coming soon
 * - 'discontinued' -> Discontinued
 */
export function AvailabilityBadge({ status, className = '' }) {
  const statusConfig = {
    available: {
      label: 'Available',
      bg: 'var(--color-status-available-bg)',
      text: 'var(--color-status-available-text)',
      border: 'var(--color-status-available-border)',
      icon: '●',
    },
    out_of_stock: {
      label: 'Out of Stock',
      bg: 'var(--color-status-outofstock-bg)',
      text: 'var(--color-status-outofstock-text)',
      border: 'var(--color-status-outofstock-border)',
      icon: '✕',
    },
    available_on_order: {
      label: 'Available on Order',
      bg: 'var(--color-status-onorder-bg)',
      text: 'var(--color-status-onorder-text)',
      border: 'var(--color-status-onorder-border)',
      icon: '⏳',
    },
    coming_soon: {
      label: 'Coming Soon',
      bg: 'var(--color-status-comingsoon-bg)',
      text: 'var(--color-status-comingsoon-text)',
      border: 'var(--color-status-comingsoon-border)',
      icon: '★',
    },
    discontinued: {
      label: 'Discontinued',
      bg: 'var(--color-status-discontinued-bg)',
      text: 'var(--color-status-discontinued-text)',
      border: 'var(--color-status-discontinued-border)',
      icon: '—',
    },
  };

  const current = statusConfig[status] || {
    label: status || 'Unknown',
    bg: 'var(--color-bg-muted)',
    text: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    icon: '•',
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
      }}
      aria-label={`Availability: ${current.label}`}
    >
      <span aria-hidden="true" style={{ fontSize: '0.7rem' }}>{current.icon}</span>
      <span>{current.label}</span>
    </span>
  );
}

/**
 * Format currency in Indian Rupees (INR)
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Price Display Component
 * Handles the 4 required modes:
 * - 'exact' -> Single amount (e.g. ₹38,500)
 * - 'range' -> Min to Max (e.g. ₹16,500 – ₹22,000)
 * - 'enquiry' -> "Price on enquiry"
 * - 'hidden' -> Does not render price
 */
export function PriceDisplay({ mode, amount, min, max, className = '' }) {
  if (mode === 'hidden') {
    return null;
  }

  if (mode === 'exact') {
    return (
      <span className={`price-exact ${className}`} style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
        {formatCurrency(amount)}
      </span>
    );
  }

  if (mode === 'range') {
    return (
      <span className={`price-range ${className}`} style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-primary)' }}>
        {formatCurrency(min)} &ndash; {formatCurrency(max)}
      </span>
    );
  }

  if (mode === 'enquiry') {
    return (
      <span className={`price-enquiry ${className}`} style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--color-accent)' }}>
        Price on enquiry
      </span>
    );
  }

  return null;
}
