import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

export function NotFoundPage() {
  return (
    <Container style={{ paddingTop: 'var(--space-16)', textAlign: 'center' }}>
      <div style={{
        fontSize: '4rem',
        fontWeight: 800,
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-heading)',
        lineHeight: 1
      }}>
        404
      </div>
      <h1 style={{ fontSize: '1.75rem', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
        Page Not Found
      </h1>
      <p style={{ maxWidth: '480px', margin: '0 auto var(--space-6) auto' }}>
        The showroom page or product you were looking for does not exist or may have been relocated.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Showroom Home</Button>
      </Link>
    </Container>
  );
}
