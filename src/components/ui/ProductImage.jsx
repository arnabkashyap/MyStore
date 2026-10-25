import React, { useState } from 'react';
import { Tv, Smartphone, Archive, Armchair, Package } from 'lucide-react';

function getCategoryIcon(category = '') {
  const cat = String(category).toLowerCase();
  if (cat.includes('elect')) return <Tv size={28} />;
  if (cat.includes('mobil') || cat.includes('phone')) return <Smartphone size={28} />;
  if (cat.includes('steel') || cat.includes('almirah') || cat.includes('rack')) return <Archive size={28} />;
  if (cat.includes('wood') || cat.includes('bed') || cat.includes('table') || cat.includes('furn')) return <Armchair size={28} />;
  return <Package size={28} />;
}

export function ProductImage({
  src,
  alt = 'Showroom product',
  category = '',
  className = '',
  style = {},
  aspectRatio = '16/10',
  height = null,
  loading = 'lazy',
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If source is missing or an error occurred during loading, render a graceful fallback
  if (!src || hasError) {
    return (
      <div
        className={`product-image-fallback ${className}`}
        style={{
          width: '100%',
          height: height || '100%',
          aspectRatio: height ? undefined : aspectRatio,
          backgroundColor: '#f1f5f9',
          color: '#64748b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)',
          textAlign: 'center',
          border: '1px solid var(--color-border)',
          ...style,
        }}
        role="img"
        aria-label={`${alt} (preview placeholder)`}
      >
        <div style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', opacity: 0.85 }}>
          {getCategoryIcon(category)}
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', maxWidth: '90%' }}>
          {alt}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Showroom Sample Image
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: height || '100%',
        aspectRatio: height ? undefined : aspectRatio,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#e2e8f0',
        ...style,
      }}
      className={`product-image-wrapper ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoaded ? 1 : 0.7,
          transition: 'opacity 0.25s ease-in-out',
        }}
      />
    </div>
  );
}
