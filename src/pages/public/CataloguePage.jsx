import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AvailabilityBadge, PriceDisplay } from '../../components/ui/Badge';
import { ProductImage } from '../../components/ui/ProductImage';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../../data/development-seed';
import { useFavourites } from '../../context/FavouritesContext';
import { Search, X, Filter, SlidersHorizontal, Heart } from 'lucide-react';

export function CataloguePage({ autoFocusSearch = false }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const { isFavourite, toggleFavourite } = useFavourites();

  const isSearchRoute = location.pathname === '/search';
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(slug || 'all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  // Autofocus search input when visiting /search or when autoFocusSearch is true or query includes search/focus
  useEffect(() => {
    if (autoFocusSearch || isSearchRoute || location.search.includes('search') || location.search.includes('focus')) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocusSearch, isSearchRoute, location.search]);

  // Keep selectedCategory synchronized with route param
  useEffect(() => {
    setSelectedCategory(slug || 'all');
  }, [slug]);

  // Handle category change from dropdown
  const handleCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    if (newCat === 'all') {
      navigate('/products');
    } else {
      navigate(`/categories/${newCat}`);
    }
  };

  // Filter products based on search, category, and availability
  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((product) => {
      // Must be published and not archived
      if (!product.is_published || product.is_archived) return false;

      // Category filter
      if (selectedCategory !== 'all' && product.category_slug !== selectedCategory) {
        return false;
      }

      // Availability filter
      if (selectedAvailability !== 'all' && product.availability_status !== selectedAvailability) {
        return false;
      }

      // Search term matching across name, brand, model, description, category, attributes
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchBrand = (product.brand || '').toLowerCase().includes(query);
        const matchModel = (product.model || '').toLowerCase().includes(query);
        const matchDesc = (product.short_description || '').toLowerCase().includes(query);
        const matchCat = (product.category_name || '').toLowerCase().includes(query);
        const matchAttributes = product.attributes
          ? Object.values(product.attributes).some((v) => String(v).toLowerCase().includes(query))
          : false;

        if (!matchName && !matchBrand && !matchModel && !matchDesc && !matchCat && !matchAttributes) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedCategory, selectedAvailability]);

  const currentCategoryObj = DEMO_CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div style={{ paddingTop: 'var(--space-6)' }}>
      <Container>
        {/* Breadcrumb Navigation */}
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <span>&gt;</span>
          {isSearchRoute ? (
            <>
              <Link to="/products" style={{ color: 'var(--color-text-muted)' }}>Catalogue</Link>
              <span>&gt;</span>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Search</span>
            </>
          ) : selectedCategory !== 'all' ? (
            <>
              <Link to="/products" style={{ color: 'var(--color-text-muted)' }}>Catalogue</Link>
              <span>&gt;</span>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {currentCategoryObj ? currentCategoryObj.name : selectedCategory}
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Catalogue</span>
          )}
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'var(--color-accent-light)',
            color: 'var(--color-accent)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            {isSearchRoute ? 'Live Showroom Search' : 'Showroom Inventory • Demo Preview'}
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: 'var(--space-2)' }}>
            {isSearchRoute
              ? 'Search Showroom Products'
              : (currentCategoryObj ? currentCategoryObj.name : 'Showroom Catalogue')}
          </h1>
          <p style={{ maxWidth: '720px', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {isSearchRoute
              ? 'Find products across all categories by name, brand, model, specifications, or attributes.'
              : (currentCategoryObj
                ? currentCategoryObj.description
                : 'Browse all products across electronics, smartphones, steel units, and wooden suites. Add items to an enquiry cart to request pricing and stock confirmation.')}
          </p>
        </div>

        {/* Filter Bar */}
        <Card style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands, models..."
                className="input-text"
                style={{ paddingLeft: '38px', paddingRight: searchTerm ? '38px' : 'var(--space-4)' }}
                aria-label="Search showroom products"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="select-input"
                aria-label="Filter by category"
              >
                <option value="all">All Showroom Categories</option>
                {DEMO_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="select-input"
                aria-label="Filter by availability"
              >
                <option value="all">All Availability Statuses</option>
                <option value="available">Available (In Showroom)</option>
                <option value="available_on_order">Available on Order</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          {/* Active Filters readout */}
          {(searchTerm || selectedCategory !== 'all' || selectedAvailability !== 'all') && (
            <div style={{
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              flexWrap: 'wrap',
              gap: 'var(--space-2)'
            }}>
              <span style={{ color: 'var(--color-text-muted)' }}>
                Showing <strong>{filteredProducts.length}</strong> matching products
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedAvailability('all');
                  navigate('/products');
                }}
                className="btn btn-outline btn-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </Card>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-16) var(--space-4)',
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)'
          }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>No matching showroom products found</h3>
            <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
              Try adjusting your search keywords or clearing availability and category filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedAvailability('all');
                navigate('/products');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const coverImg = product.images.find((img) => img.is_cover) || product.images[0];
              return (
                <Card
                  key={product.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                  }}
                >
                  {/* Image container with ProductImage */}
                  <div style={{
                    height: '200px',
                    backgroundColor: 'var(--color-bg-muted)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <ProductImage
                      src={coverImg.url}
                      alt={coverImg.alt_text}
                      category={product.category_slug}
                      height="200px"
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
                        top: '10px',
                        left: '10px',
                        zIndex: 3,
                        width: '34px',
                        height: '34px',
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
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                        transition: 'all var(--transition-fast)'
                      }}
                      aria-label={isFavourite(product.id) ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
                      title={isFavourite(product.id) ? 'Remove from favourites' : 'Save to favourites'}
                    >
                      <Heart size={17} fill={isFavourite(product.id) ? '#e11d48' : 'none'} />
                    </button>

                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
                      <AvailabilityBadge status={product.availability_status} />
                    </div>
                  </div>

                  {/* Body Content */}
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

                    {/* Price and Action */}
                    <div style={{
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: 'var(--space-3)',
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
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
        )}
      </Container>
    </div>
  );
}
