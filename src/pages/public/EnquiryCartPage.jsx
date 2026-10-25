import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PriceDisplay, AvailabilityBadge } from '../../components/ui/Badge';
import { ProductImage } from '../../components/ui/ProductImage';
import { useEnquiryCart } from '../../context/EnquiryCartContext';
import { ShoppingBag, ArrowLeft, ShieldAlert, Trash2, Plus, Minus, ArrowRight, Store } from 'lucide-react';

export function EnquiryCartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItemsCount,
    uniqueItemsCount
  } = useEnquiryCart();

  const [customerMessage, setCustomerMessage] = useState('');

  return (
    <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'calc(var(--space-12) + 4.5rem + env(safe-area-inset-bottom, 0px))' }}>
      <Container>
        {/* Header & Back Link */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-2)'
            }}
          >
            <ArrowLeft size={16} /> Back to Showroom Catalogue
          </Link>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 'var(--space-2)'
          }}>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', margin: 0 }}>
              Showroom Enquiry Cart
            </h1>
            {items.length > 0 && (
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {uniqueItemsCount} {uniqueItemsCount === 1 ? 'product' : 'products'} ({totalItemsCount} total units)
              </span>
            )}
          </div>
          <p style={{ marginTop: 'var(--space-2)', maxWidth: '720px', fontSize: '0.95rem' }}>
            Review the showroom items you would like to ask about. When enquiry submission is connected, our showroom team will call your verified phone number to discuss physical stock, finish options, and delivery.
          </p>
        </div>

        {/* Phase 1 / Phase 4 Scope Disclosure */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <ShieldAlert size={20} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 700, marginBottom: '0.2rem' }}>
                Phase 1 Prototype: Enquiry Submission Connects in Phase 4
              </div>
              <p style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.5, margin: 0 }}>
                In this Phase 1 demonstration, enquiry cart state persists locally across routes. Live enquiry submission requires customer phone number verification via <strong>Supabase Phone OTP</strong>, which will be connected in <strong>Phase 4</strong> after backend setup. No mock enquiries are falsely recorded.
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <Card style={{
            textAlign: 'center',
            padding: 'var(--space-16) var(--space-6)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div style={{
              width: '4.5rem',
              height: '4.5rem',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4) auto',
              color: 'var(--color-primary)'
            }}>
              <ShoppingBag size={32} />
            </div>
            <h2 style={{ fontSize: '1.45rem', marginBottom: 'var(--space-2)' }}>
              Your Enquiry Cart is Empty
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              maxWidth: '520px',
              margin: '0 auto var(--space-6) auto',
              fontSize: '0.95rem',
              lineHeight: 1.5
            }}>
              Browse our showroom catalogue across electronics, smartphones, heavy-gauge steel almirahs, and handcrafted wooden furniture. Click <strong>"Add to Product Enquiry"</strong> on any item to build your list.
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg">
                Browse Showroom Catalogue &rarr;
              </Button>
            </Link>
          </Card>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Items List */}
            <div style={{ gridColumn: 'span 2' }}>
              <Card style={{ padding: 'var(--space-5)' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 'var(--space-4)',
                  borderBottom: '1px solid var(--color-border)',
                  marginBottom: 'var(--space-4)'
                }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                    Selected Showroom Products
                  </h3>
                  <button
                    type="button"
                    onClick={clearCart}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                    title="Remove all items from enquiry cart"
                  >
                    <Trash2 size={15} /> Clear All
                  </button>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {items.map((item) => {
                    const coverImg = item.product.images?.find((img) => img.is_cover) || item.product.images?.[0];
                    return (
                      <div
                        key={item.product.id}
                        style={{
                          display: 'flex',
                          gap: 'var(--space-4)',
                          paddingBottom: 'var(--space-4)',
                          borderBottom: '1px solid var(--color-border)',
                          flexDirection: 'row',
                          alignItems: 'flex-start'
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: 'var(--color-bg-muted)'
                        }}>
                          <ProductImage
                            src={coverImg?.url}
                            alt={coverImg?.alt_text || item.product.name}
                            category={item.product.category_slug}
                            height="84px"
                          />
                        </div>

                        {/* Item Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: 'var(--color-accent)',
                              textTransform: 'uppercase'
                            }}>
                              {item.product.category_name}
                            </span>
                            <AvailabilityBadge status={item.product.availability_status} />
                          </div>

                          <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', lineHeight: 1.3 }}>
                            <Link to={`/products/${item.product.slug}`} style={{ color: 'var(--color-text-primary)' }}>
                              {item.product.name}
                            </Link>
                          </h4>

                          {item.product.brand && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                              Brand: <strong>{item.product.brand}</strong> {item.product.model && `• ${item.product.model}`}
                            </div>
                          )}

                          <div style={{ fontSize: '0.95rem', marginBottom: 'var(--space-2)' }}>
                            <PriceDisplay
                              mode={item.product.price_mode}
                              amount={item.product.price_amount}
                              min={item.product.price_min}
                              max={item.product.price_max}
                            />
                          </div>

                          {/* Quantity Controls & Remove */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                Qty:
                              </span>
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden'
                              }}>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  style={{
                                    padding: '0.3rem 0.5rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                    opacity: item.quantity <= 1 ? 0.4 : 1,
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span style={{
                                  padding: '0.3rem 0.65rem',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  backgroundColor: 'var(--color-bg-card)',
                                  minWidth: '2rem',
                                  textAlign: 'center'
                                }}>
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  style={{
                                    padding: '0.3rem 0.5rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                fontSize: '0.825rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem'
                              }}
                              aria-label={`Remove ${item.product.name} from enquiry`}
                            >
                              <Trash2 size={15} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Message Field */}
                <div style={{ marginTop: 'var(--space-6)' }}>
                  <label
                    htmlFor="customer-message"
                    style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-2)' }}
                  >
                    Optional Notes for Showroom Team
                  </label>
                  <textarea
                    id="customer-message"
                    rows={3}
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    className="input-text"
                    placeholder="e.g. Inquire about steel gauge thickness, delivery timelines, or color finishes..."
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    Note: In Phase 4, your notes will accompany the SMS OTP verified phone enquiry.
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Submission Panel */}
            <div>
              <Card style={{ position: 'sticky', top: '5.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-3)' }}>
                  Enquiry Summary
                </h3>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2) 0',
                  borderBottom: '1px solid var(--color-border)',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Distinct Products</span>
                  <strong>{uniqueItemsCount}</strong>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2) 0',
                  borderBottom: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  marginBottom: 'var(--space-4)'
                }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Total Requested Units</span>
                  <strong>{totalItemsCount}</strong>
                </div>

                {/* Explanation Card */}
                <div style={{
                  backgroundColor: 'var(--color-bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  marginBottom: 'var(--space-4)',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.45
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                    Showroom Direct Follow-up:
                  </div>
                  Submitting an enquiry prompts our showroom representative to inspect physical showroom stock, confirm wholesale or seasonal pricing, and call you directly.
                </div>

                {/* Disabled Submission Button with Phase 4 Label */}
                <Button
                  variant="primary"
                  disabled
                  style={{
                    width: '100%',
                    marginBottom: 'var(--space-3)',
                    opacity: 0.65,
                    cursor: 'not-allowed',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--space-3)'
                  }}
                  title="Phone OTP verification connects in Phase 4"
                >
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Submit Enquiry
                  </span>
                  <span style={{ fontSize: '0.725rem', opacity: 0.9 }}>
                    (Requires Phone OTP in Phase 4)
                  </span>
                </Button>

                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  marginBottom: 'var(--space-4)'
                }}>
                  No online payment is processed. You will never be asked for card details.
                </div>

                <Link
                  to="/products"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}
                >
                  Continue browsing catalogue <ArrowRight size={14} />
                </Link>
              </Card>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
