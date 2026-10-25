import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AvailabilityBadge, PriceDisplay } from '../../components/ui/Badge';
import { ProductImage } from '../../components/ui/ProductImage';
import { useFavourites } from '../../context/FavouritesContext';
import { useEnquiryCart } from '../../context/EnquiryCartContext';
import { Heart, Trash2, ArrowLeft, ArrowRight, Plus, Check, ShoppingBag } from 'lucide-react';

export function FavouritesPage() {
  const { favourites, removeFavourite, clearFavourites } = useFavourites();
  const { addItem, totalItemsCount } = useEnquiryCart();
  const [addedItemMap, setAddedItemMap] = useState({});

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'calc(var(--space-12) + 4rem)' }}>
      <Container>
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <span>&gt;</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Showroom Favourites</span>
        </div>

        {/* Page Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(225, 29, 72, 0.1)',
              color: '#e11d48',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <Heart size={13} fill="currentColor" />
              <span>Personal Wishlist</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', margin: 0 }}>
              Saved Favourites
            </h1>
            <p style={{ marginTop: '0.4rem', color: 'var(--color-text-secondary)', maxWidth: '640px', fontSize: '0.95rem' }}>
              Keep track of showroom electronics and furniture pieces you love. Products remain saved in this browser across sessions.
            </p>
          </div>

          {favourites.length > 0 && (
            <button
              type="button"
              onClick={clearFavourites}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: 'var(--color-bg-card)',
                transition: 'all var(--transition-fast)'
              }}
              title="Clear all saved favourites"
            >
              <Trash2 size={15} /> Clear All Favourites
            </button>
          )}
        </div>

        {/* Empty State */}
        {favourites.length === 0 ? (
          <Card style={{
            textAlign: 'center',
            padding: 'var(--space-16) var(--space-6)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div style={{
              width: '4.5rem',
              height: '4.5rem',
              backgroundColor: 'rgba(225, 29, 72, 0.08)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4) auto',
              color: '#e11d48'
            }}>
              <Heart size={32} />
            </div>
            <h2 style={{ fontSize: '1.45rem', marginBottom: 'var(--space-2)' }}>
              Your Favourites List is Empty
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              maxWidth: '520px',
              margin: '0 auto var(--space-6) auto',
              fontSize: '0.95rem',
              lineHeight: 1.5
            }}>
              Browse our showroom collection and tap the heart icon on any product to save it here for quick reference during your showroom visit or enquiry.
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg">
                Explore Showroom Catalogue &rarr;
              </Button>
            </Link>
          </Card>
        ) : (
          /* Products Grid */
          <div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-4)'
            }}>
              Showing <strong>{favourites.length}</strong> {favourites.length === 1 ? 'saved product' : 'saved products'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favourites.map((product) => {
                const coverImg = product.images?.find((img) => img.is_cover) || product.images?.[0];
                const isAdded = addedItemMap[product.id];

                return (
                  <Card
                    key={product.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 0,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                    }}
                  >
                    {/* Image container */}
                    <div style={{
                      height: '200px',
                      backgroundColor: 'var(--color-bg-muted)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <ProductImage
                        src={coverImg?.url}
                        alt={coverImg?.alt_text || product.name}
                        category={product.category_slug}
                        height="200px"
                      />

                      {/* Remove from favourites button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFavourite(product.id);
                        }}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          zIndex: 3,
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1px solid rgba(225, 29, 72, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#e11d48',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                          transition: 'all var(--transition-fast)'
                        }}
                        aria-label={`Remove ${product.name} from favourites`}
                        title="Remove from favourites"
                      >
                        <Heart size={18} fill="#e11d48" />
                      </button>

                      {/* Availability badge */}
                      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
                        <AvailabilityBadge status={product.availability_status} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                        textTransform: 'uppercase',
                        marginBottom: '0.2rem'
                      }}>
                        {product.category_name}
                      </div>

                      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                        <Link to={`/products/${product.slug}`} style={{ color: 'var(--color-text-primary)' }}>
                          {product.name}
                        </Link>
                      </h3>

                      {product.brand && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                          Brand: <strong>{product.brand}</strong> {product.model && `• ${product.model}`}
                        </div>
                      )}

                      <p style={{
                        fontSize: '0.825rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.4,
                        marginBottom: 'var(--space-4)',
                        flex: 1
                      }}>
                        {product.short_description}
                      </p>

                      {/* Price and Details */}
                      <div style={{
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: 'var(--space-3)',
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: 'var(--space-3)'
                      }}>
                        <PriceDisplay
                          mode={product.price_mode}
                          amount={product.price_amount}
                          min={product.price_min}
                          max={product.price_max}
                        />
                        <Link to={`/products/${product.slug}`}>
                          <Button variant="outline" size="sm">
                            Details &rarr;
                          </Button>
                        </Link>
                      </div>

                      {/* Add to Enquiry Button */}
                      <Button
                        variant={isAdded ? 'outline' : 'primary'}
                        size="sm"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          backgroundColor: isAdded ? '#ecfdf5' : undefined,
                          borderColor: isAdded ? '#a7f3d0' : undefined,
                          color: isAdded ? '#065f46' : undefined
                        }}
                        onClick={() => handleAddToCart(product)}
                      >
                        {isAdded ? (
                          <>
                            <Check size={15} /> Added to Enquiry Cart
                          </>
                        ) : (
                          <>
                            <Plus size={15} /> Add to Enquiry Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default FavouritesPage;
