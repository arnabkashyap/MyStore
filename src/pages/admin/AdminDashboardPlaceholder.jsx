import React from 'react';
import { Card } from '../../components/ui/Card';
import {
  Package,
  Layers,
  Inbox,
  Receipt,
  TrendingUp,
  History,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export function AdminDashboardPlaceholder() {
  const modules = [
    {
      title: 'Catalogue Management',
      icon: <Package size={22} color="#1e3a8a" />,
      desc: 'Create, edit, archive products, upload multiple gallery photos, set cover images, manage price display modes and availability status.',
      phase: 'Phase 5',
    },
    {
      title: 'Category Organization',
      icon: <Layers size={22} color="#b45309" />,
      desc: 'Add, reorder, activate or deactivate categories. Dynamic and data-driven without hardcoded limits.',
      phase: 'Phase 5',
    },
    {
      title: 'Enquiry Inbox & Follow-Up',
      icon: <Inbox size={22} color="#047857" />,
      desc: 'Search by reference or phone, view item snapshots, click-to-call verified numbers, update statuses, and log private follow-up notes.',
      phase: 'Phase 5',
    },
    {
      title: 'Private Sales Register',
      icon: <Receipt size={22} color="#4338ca" />,
      desc: 'Record actual transactions with immutable unit cost snapshots, unit selling price, discounts, and payment methods (Cash, UPI, Card, Bank Transfer).',
      phase: 'Phase 6',
    },
    {
      title: 'Profit & Period Reports',
      icon: <TrendingUp size={22} color="#0891b2" />,
      desc: 'Reconcile net revenue, COGS, gross profit, sale-specific expenses, and estimated net profit across daily, monthly, and custom periods.',
      phase: 'Phase 6',
    },
    {
      title: 'Audit History & Security',
      icon: <History size={22} color="#475569" />,
      desc: 'Tamper-resistant database audit logs tracking administrative pricing, sale edits, status transitions, and payments.',
      phase: 'Phase 6',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: '1.85rem', marginBottom: 'var(--space-2)' }}>
          Private Administration System Architecture
        </h2>
        <p style={{ maxWidth: '720px' }}>
          This workspace is the administrative core for the showroom owner and website operator. In accordance with Phase 1 constraints, real authentication and authorization are deferred until Supabase database schema and Row Level Security (RLS) policies are deployed.
        </p>
      </div>

      {/* Security Architectural Notice */}
      <Card style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        marginBottom: 'var(--space-8)',
        padding: 'var(--space-5)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          <AlertTriangle size={24} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '1rem', color: '#991b1b', marginBottom: '0.25rem' }}>
              Security Architecture Guardrail (Phase 1)
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#7f1d1d', lineHeight: 1.5, margin: 0 }}>
              Per project specifications, administrative access will never be granted via public sign-up or client-only route checks. Real authorization will be enforced at the PostgreSQL level via an <code>is_admin()</code> function and strict RLS policies on the <code>admin_users</code> table in Phase 2 &amp; Phase 5.
            </p>
          </div>
        </div>
      </Card>

      {/* Modules Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => (
          <Card key={m.title} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'var(--color-bg-muted)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {m.icon}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-light)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                {m.phase}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>{m.title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
              {m.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
