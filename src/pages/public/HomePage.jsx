import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AvailabilityBadge, PriceDisplay } from '../../components/ui/Badge';
import { ProductImage } from '../../components/ui/ProductImage';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../../data/development-seed';
import { useEnquiryCart } from '../../context/EnquiryCartContext';
import { useFavourites } from '../../context/FavouritesContext';
import { PhoneCall, Search, ArrowRight, Shield, Sparkles, ShoppingBag, Store, CheckCircle2, Heart } from 'lucide-react';

export function HomePage() {
  const featuredProducts = DEMO_PRODUCTS.filter((p) => p.is_featured);
  const { totalItemsCount } = useEnquiryCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <div>
      {/* Refined Two-Column Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 65%, #172554 100%)',
        color: '#ffffff',
        padding: 'clamp(2.5rem, 5vw, 4rem) 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(180, 83, 9, 0.15) 0%, rgba(30, 58, 138, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <Container>
          <div className="hero-grid">
            {/* Left Column: Text & Calls to Action */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fef08a',
                marginBottom: 'var(--space-4)',
                width: 'fit-content'
              }}>
                <Sparkles size={16} />
                <span>Multi-Category Physical Showroom Catalogue</span>
              </div>

              <h1 style={{
                color: '#ffffff',
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                lineHeight: 1.15,
                marginBottom: 'var(--space-4)',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Baishya Furniture and Telectronics
              </h1>

              <p style={{
                color: '#cbd5e1',
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                lineHeight: 1.6,
                marginBottom: 'var(--space-6)',
                maxWidth: '620px'
              }}>
                Explore our curated showroom collection of quality home electronics, 5G smartphones, heavy-duty steel almirahs, and handcrafted wooden furniture. Browse products as a guest and build an enquiry cart for personalized showroom assistance.
              </p>

              {/* Action Button */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)'
              }}>
                <Link to="/products">
                  <Button variant="secondary" size="lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
                    Browse Full Catalogue &rarr;
                  </Button>
                </Link>
              </div>

              {/* Category highlight pills */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#94a3b8'
              }}>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  • Electronics &amp; Appliances
                </span>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  • Mobile Phones
                </span>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  • Steel Almirahs &amp; Storage
                </span>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  • Handcrafted Wooden Suites
                </span>
              </div>
            </div>

            {/* Right Column: Polished Visual Frame */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: 'var(--shadow-xl)',
                backgroundColor: '#1e293b'
              }}>
                <img
                  src="/images/hero-showroom-showcase.jpg"
                  alt="Showroom display featuring fine wooden furniture and modern smart electronics"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '380px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="eager"
                />

                {/* Glassmorphic Overlay Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  right: '14px',
                  backgroundColor: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '2.2rem',
                    height: '2.2rem',
                    backgroundColor: 'rgba(180, 83, 9, 0.35)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fef08a',
                    flexShrink: 0
                  }}>
                    <Store size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                      Physical Showroom Selection
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                      Electronics • Mobiles • Steel • Wooden Furniture
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <style>{`
          .hero-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
          @media (min-width: 992px) {
            .hero-grid {
              grid-template-columns: 1.15fr 0.85fr;
              gap: var(--space-10);
              align-items: center;
            }
          }
        `}</style>
      </section>

      {/* Showroom Categories Section */}
      <section style={{ padding: 'clamp(2.5rem, 4vw, 3.5rem) 0', backgroundColor: 'var(--color-bg-card)' }}>
        <Container>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-8)'
          }}>
            <h2 style={{ fontSize: '1.85rem' }}>Showroom Categories</h2>
            <p>Browse by department to view available models, materials, and display price options.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {DEMO_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Card style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'var(--space-5)',
                  cursor: 'pointer'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--color-text-primary)' }}>
                      {category.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {category.description}
                    </p>
                  </div>
                  <div style={{
                    marginTop: 'var(--space-4)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    Explore &rarr;
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: 'clamp(2.5rem, 4vw, 3.5rem) 0', backgroundColor: 'var(--color-bg-main)' }}>
        <Container>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-8)',
            gap: 'var(--space-4)'
          }}>
            <div>
              <h2 style={{ fontSize: '1.85rem' }}>Featured Showroom Items</h2>
              <p>Highlights across electronics, steel storage, and wooden suites.</p>
            </div>
            <Link to="/products" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              View all products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const coverImg = product.images.find((img) => img.is_cover) || product.images[0];
              return (
                <Card key={product.id} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                  <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    <ProductImage
                      src={coverImg.url}
                      alt={coverImg.alt_text}
                      category={product.category_slug}
                      height="220px"
                    />

                    {/* Favourite button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavourite(product);
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 3,
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: isFavourite(product.id) ? '1px solid rgba(225, 29, 72, 0.35)' : '1px solid rgba(226, 232, 240, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isFavourite(product.id) ? '#e11d48' : '#64748b',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                        transition: 'all var(--transition-fast)'
                      }}
                      aria-label={isFavourite(product.id) ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
                      title={isFavourite(product.id) ? 'Remove from favourites' : 'Save to favourites'}
                    >
                      <Heart size={18} fill={isFavourite(product.id) ? '#e11d48' : 'none'} />
                    </button>

                    <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                      <AvailabilityBadge status={product.availability_status} />
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {product.category_name}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>
                      <Link to={`/products/${product.slug}`} style={{ color: 'var(--color-text-primary)' }}>
                        {product.name}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', flex: 1 }}>
                      {product.short_description}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: 'var(--space-4)',
                      marginTop: 'auto'
                    }}>
                      <div>
                        <PriceDisplay
                          mode={product.price_mode}
                          amount={product.price_amount}
                          min={product.price_min}
                          max={product.price_max}
                        />
                      </div>
                      <Link to={`/products/${product.slug}`}>
                        <Button variant="outline" size="sm">
                          Details &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* The Enquiry Process Steps */}
      <section style={{ padding: 'clamp(2.5rem, 4vw, 3.5rem) 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
        <Container>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-12) auto' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: 'var(--space-3)' }}>How Showroom Enquiries Work</h2>
            <p>
              We preserve a personalized showroom experience. No automated checkout or forced payments—our owner reviews every enquiry and connects with you personally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto'
              }}>
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>1. Browse &amp; Build Cart</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Browse freely as a guest. Add wooden furniture, electronics, or steel storage items to your enquiry cart.
              </p>
            </Card>

            <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                backgroundColor: 'var(--color-accent-light)',
                color: 'var(--color-accent)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto'
              }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>2. Phone OTP Verification</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Before submitting, verify your phone number via a quick SMS code to protect against spam and ensure contact accuracy.
              </p>
            </Card>

            <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto'
              }}>
                <PhoneCall size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>3. Direct Phone Follow-Up</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Our showroom owner reviews stock availability, discusses delivery/options, and confirms the final price with you over the phone.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
