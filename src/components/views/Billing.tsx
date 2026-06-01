import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown, Shield, CreditCard, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

interface PlanConfig {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  credits: number;
  features: string[];
  recommended?: boolean;
  cta: string;
}

const PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: '/month',
    description: 'Perfect for trying out StockSEO AI',
    icon: <Zap size={20} />,
    color: '#64748B',
    gradient: 'linear-gradient(135deg, #64748B, #94A3B8)',
    credits: 50,
    features: [
      '50 AI generations/month',
      'Single image processing',
      'Basic metadata fields',
      '3 marketplace profiles',
      'CSV export only',
      'Community support',
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: '/month',
    description: 'For active stock contributors',
    icon: <Star size={20} />,
    color: '#007BFF',
    gradient: 'linear-gradient(135deg, #007BFF, #00C4CC)',
    credits: 500,
    features: [
      '500 AI generations/month',
      'Batch processing (50 images)',
      'All metadata fields + SEO scoring',
      'All 6 marketplace profiles',
      'CSV, XLSX, JSON, TXT export',
      'Individual field regeneration',
      'Custom prompt templates',
      'Priority email support',
    ],
    recommended: true,
    cta: 'Start Pro Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: '/month',
    description: 'For agencies & high-volume contributors',
    icon: <Crown size={20} />,
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #FF4EAD, #7C3AED)',
    credits: 5000,
    features: [
      '5,000 AI generations/month',
      'Unlimited batch processing',
      'Multi-provider AI orchestration',
      'Admin portal access',
      'Team collaboration (5 seats)',
      'API access + webhooks',
      'White-label exports',
      'Dedicated account manager',
      'SLA guarantee (99.9% uptime)',
    ],
    cta: 'Contact Sales',
  },
];

const ADD_ONS = [
  { label: '100 Extra Credits', price: '$4.99', desc: 'Top up when you need it' },
  { label: '500 Extra Credits', price: '$19.99', desc: 'Best value top-up pack' },
  { label: '2,000 Extra Credits', price: '$69.99', desc: 'Bulk credit purchase' },
];

export function Billing() {
  const { user } = useAppStore();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Billing & Plans</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your subscription, credits, and payment methods</p>
        </div>
        <Badge variant="info" size="md">
          <Shield size={11} />
          Stripe Secured Payments
        </Badge>
      </motion.div>

      {/* Current Plan */}
      {user && (
        <GlassCard className="p-5" delay={0.05}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
                <Star size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Current Plan: {user.tier}</p>
                <p className="text-xs text-[var(--text-muted)]">Renews in 12 days</p>
              </div>
            </div>
            <div className="h-8 w-px bg-[var(--border)] hidden sm:block" />
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">{user.creditsUsed}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Used</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-primary)]">{user.credits - user.creditsUsed}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-primary)]">{user.credits}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Total</div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" icon={<CreditCard size={13} />}>
                Billing Portal
              </Button>
              <Button variant="ghost" size="sm">Cancel Plan</Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className={cn(
              'bubble-glass rounded-2xl p-6 relative overflow-hidden flex flex-col',
              plan.recommended && 'ring-2 ring-[var(--accent-primary)]/40 shadow-xl',
            )}
          >
            {plan.recommended && (
              <div
                className="absolute top-4 right-4 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: plan.gradient }}
              >
                <Sparkles size={10} /> Most Popular
              </div>
            )}

            {/* Background gradient orb */}
            <div
              className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20"
              style={{ background: plan.gradient }}
            />

            <div className="relative z-10 flex-1 flex flex-col">
              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                  style={{ background: plan.gradient }}
                >
                  {plan.icon}
                </div>
                <div>
                  <div className="font-bold text-[var(--text-primary)]">{plan.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{plan.credits.toLocaleString()} credits/mo</div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-[var(--text-primary)]">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-[var(--text-muted)] mb-1.5">{plan.period}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${plan.color}20`, color: plan.color }}
                    >
                      <Check size={9} />
                    </div>
                    <span className="text-[var(--text-secondary)]">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={cn(
                  'w-full py-3 rounded-xl font-semibold text-sm transition-all',
                  plan.recommended
                    ? 'btn-gradient text-white shadow-lg hover:shadow-xl'
                    : 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]',
                )}
              >
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Credit Add-ons */}
      <GlassCard className="p-5" delay={0.4}>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Zap size={15} className="text-[var(--accent-primary)]" />
          Credit Top-Ups
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ADD_ONS.map((addon, i) => (
            <motion.div
              key={addon.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.07 }}
              className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all group"
            >
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{addon.label}</div>
                <div className="text-xs text-[var(--text-muted)]">{addon.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold gradient-text">{addon.price}</div>
                <button className="text-xs text-[var(--accent-primary)] mt-1 flex items-center gap-1 hover:underline">
                  Buy <ArrowUpRight size={10} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Payment Integration Notice */}
      <GlassCard className="p-4" delay={0.5}>
        <div className="flex items-center gap-3">
          <CreditCard size={18} className="text-[var(--accent-primary)] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Payment Integration Ready</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Stripe payment processing is pre-configured. Connect your Stripe account in the backend environment variables 
              (<code className="font-mono bg-[var(--bg-tertiary)] px-1 rounded">STRIPE_SECRET_KEY</code>) to enable live billing.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
