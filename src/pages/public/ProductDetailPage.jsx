import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AvailabilityBadge, PriceDisplay } from '../../components/ui/Badge';
import { ProductImage } from '../../components/ui/ProductImage';
import { DEMO_PRODUCTS } from '../../data/development-seed';
import { useEnquiryCart } from '../../context/EnquiryCartContext';
import { useFavourites } from '../../context/FavouritesContext';
import { PhoneCall, ShieldCheck, ArrowLeft, Plus, Check, Info, ShoppingBag, Heart } from 'lucide-react';

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = DEMO_PRODUCTS.find((p) => p.slug === slug);
  const { addItem, totalItemsCount } = useEnquiryCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [enquiryAdded, setEnquiryAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Container style={{ paddingTop: 'var(--space-12)', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          The requested showroom product could not be located or may have been unlisted.
        </p>
        <Link to="/products">
          <Button variant="primary">Return to Catalogue</Button>
        </Link>
      </Container>
    );
  }

  const activeImage = product.images[activeImageIndex] || product.images[0];

  const handleAddToEnquiry = () => {
    addItem(product, quantity);
    setEnquiryAdded(true);
    setTimeout(() => setEnquiryAdded(false), 4500);
  };

  return (
    <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'calc(var(--space-12) + 4rem + env(safe-area-inset-bottom, 0px))' }}>
      <Container>
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <span>&gt;</span>
          <Link to="/products" style={{ color: 'var(--color-text-muted)' }}>Catalogue</Link>
          <span>&gt;</span>
          <Link to={`/categories/${product.category_slug}`} style={{ color: 'var(--color-text-muted)' }}>
            {product.category_name}
          </Link>
          <span>&gt;</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginBottom: 'var(--space-12)' }}>
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Featured Photo */}
            <div style={{
              height: '420px',
              backgroundColor: 'var(--color-bg-muted)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--color-border)',
              marginBottom: 'var(--space-4)'
            }}>
              <ProductImage
                src={activeImage.url}
                alt={activeImage.alt_text}
                category={product.category_slug}
                height="420px"
              />

              {/* Favourite button */}
              <button
                type="button"
                onClick={() => toggleFavourite(product)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  zIndex: 3,
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: isFavourite(product.id) ? '1px solid rgba(225, 29, 72, 0.35)' : '1px solid rgba(226, 232, 240, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isFavourite(product.id) ? '#e11d48' : '#64748b',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.14)',
                  transition: 'all var(--transition-fast)'
                }}
                aria-label={isFavourite(product.id) ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
                title={isFavourite(product.id) ? 'Remove from favourites' : 'Save to favourites'}
              >
                <Heart size={21} fill={isFavourite(product.id) ? '#e11d48' : 'none'} />
              </button>

              <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2 }}>
                <AvailabilityBadge status={product.availability_status} />
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      padding: 0,
                      backgroundColor: 'var(--color-bg-muted)',
                      flexShrink: 0
                    }}
                    aria-label={`View photo ${idx + 1}: ${img.alt_text}`}
                  >
                    <ProductImage
                      src={img.url}
                      alt={img.alt_text}
                      category={product.category_slug}
                      height="100%"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Enquiry Action */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-2)'
            }}>
              <span>{product.category_name}</span>
              <span>&bull;</span>
              <span>Demo Catalogue</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', marginBottom: 'var(--space-3)', lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Brand / Model / SKU metadata */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              {product.brand && (
                <div>Brand: <strong style={{ color: 'var(--color-text-primary)' }}>{product.brand}</strong></div>
              )}
              {product.model && (
                <div>Model: <strong style={{ color: 'var(--color-text-primary)' }}>{product.model}</strong></div>
              )}
              {product.sku && (
                <div>Showroom SKU: <strong style={{ color: 'var(--color-text-primary)' }}>{product.sku}</strong></div>
              )}
            </div>

            {/* Price Box */}
            <div style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                Showroom Display Price
              </div>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>
                <PriceDisplay
                  mode={product.price_mode}
                  amount={product.price_amount}
                  min={product.price_min}
                  max={product.price_max}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {product.price_mode === 'exact' && 'Catalog listed price. Special festival offers or package discounts confirmed via phone.'}
                {product.price_mode === 'range' && 'Price varies based on dimensions, gauge thickness, or custom configuration.'}
                {product.price_mode === 'enquiry' && 'Price confirmed directly by phone based on current manufacturer batch and delivery terms.'}
                {product.price_mode === 'hidden' && 'Custom quotation provided directly by our showroom team.'}
              </p>
            </div>

            {/* Short Description */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>Overview</h2>
              <p style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                {product.description || product.short_description}
              </p>
            </div>

            {/* Specifications / Attributes Table */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>Showroom Specifications</h3>
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}>
                  {Object.entries(product.attributes).map(([key, val], idx) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        backgroundColor: idx % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-muted)',
                        borderBottom: idx === Object.keys(product.attributes).length - 1 ? 'none' : '1px solid var(--color-border)'
                      }}
                    >
                      <div style={{ width: '40%', fontWeight: 600, textTransform: 'capitalize', color: 'var(--color-text-secondary)' }}>
                        {key.replace('_', ' ')}
                      </div>
                      <div style={{ width: '60%', color: 'var(--color-text-primary)' }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enquiry Action Panel */}
            <Card style={{ backgroundColor: 'var(--color-bg-muted)', border: '1px solid var(--color-border-hover)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                {/* Quantity selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="enquiry-qty" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Qty:
                  </label>
                  <select
                    id="enquiry-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="select-input"
                    style={{ width: '70px', padding: '0.4rem 0.6rem' }}
                    aria-label="Select quantity for enquiry"
                  >
                    {[1, 2, 3, 4, 5, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={handleAddToEnquiry}
                  >
                    {enquiryAdded ? (
                      <>
                        <Check size={20} color="#86efac" />
                        <span>Added {quantity} to Enquiry Cart!</span>
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Add to Product Enquiry</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Favourites Button */}
              <div style={{ marginTop: 'var(--space-3)' }}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    borderColor: isFavourite(product.id) ? 'rgba(225, 29, 72, 0.45)' : 'var(--color-border-strong)',
                    backgroundColor: isFavourite(product.id) ? 'rgba(225, 29, 72, 0.08)' : 'var(--color-bg-card)',
                    color: isFavourite(product.id) ? '#e11d48' : 'var(--color-text-primary)'
                  }}
                  onClick={() => toggleFavourite(product)}
                  aria-label={isFavourite(product.id) ? 'Remove product from favourites' : 'Save product to showroom favourites'}
                >
                  <Heart
                    size={18}
                    fill={isFavourite(product.id) ? '#e11d48' : 'none'}
                    color={isFavourite(product.id) ? '#e11d48' : 'currentColor'}
                  />
                  <span>
                    {isFavourite(product.id) ? 'Saved in Showroom Favourites' : 'Save to Showroom Favourites'}
                  </span>
                </Button>
              </div>

              {/* Feedback Alert */}
              {enquiryAdded && (
                <div style={{
                  marginTop: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-md)',
                  color: '#065f46',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-2)',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={16} />
                    <span>Added to enquiry cart.</span>
                  </div>
                  <Link to="/enquiry" style={{ color: '#065f46', fontWeight: 700, textDecoration: 'underline' }}>
                    View Enquiry Cart ({totalItemsCount}) &rarr;
                  </Link>
                </div>
              )}

              <div style={{
                marginTop: 'var(--space-3)',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.4rem'
              }}>
                <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Adding to enquiry reserves nothing and costs nothing. Our showroom manager verifies physical stock and arranges delivery upon your phone confirmation.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
