import { motion } from 'framer-motion';
import {
  Image, ShoppingBag, Zap, Award,
  Users, Star, ArrowUpRight, Activity, Clock, Cpu, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { StatCard } from '../ui/StatCard';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const AREA_DATA = [
  { day: 'Mon', images: 320, keywords: 12800, score: 84 },
  { day: 'Tue', images: 480, keywords: 19200, score: 86 },
  { day: 'Wed', images: 390, keywords: 15600, score: 85 },
  { day: 'Thu', images: 720, keywords: 28800, score: 88 },
  { day: 'Fri', images: 650, keywords: 26000, score: 87 },
  { day: 'Sat', images: 410, keywords: 16400, score: 89 },
  { day: 'Sun', images: 580, keywords: 23200, score: 91 },
];

const MARKETPLACE_DATA = [
  { name: 'Adobe', value: 38, color: '#FF0000' },
  { name: 'Shutterstock', value: 24, color: '#EE3423' },
  { name: 'Freepik', value: 18, color: '#1273EB' },
  { name: 'iStock', value: 12, color: '#009999' },
  { name: 'Dreamstime', value: 5, color: '#0A6E37' },
  { name: 'Alamy', value: 3, color: '#4B2991' },
];

const RECENT_ACTIVITY = [
  { id: 1, action: 'Batch processed 48 nature images', marketplace: 'Adobe Stock', time: '2m ago', score: 91 },
  { id: 2, action: 'Single image generated for Adobe Stock', marketplace: 'Shutterstock', time: '14m ago', score: 88 },
  { id: 3, action: 'Exported 120 metadata records as CSV', marketplace: 'Freepik', time: '32m ago', score: 86 },
  { id: 4, action: 'Bulk processed 200 editorial images', marketplace: 'iStock', time: '1h ago', score: 84 },
  { id: 5, action: 'Template "Nature Landscapes" created', marketplace: 'Alamy', time: '2h ago', score: 90 },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
  return n.toString();
}

export function Dashboard() {
  const { stats, setActiveSection } = useAppStore();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Platform Overview
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Real-time analytics · Updated just now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" size="md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block pulse-dot" />
            All Systems Operational
          </Badge>
          <Button
            variant="gradient"
            size="sm"
            icon={<Zap size={14} />}
            onClick={() => setActiveSection('generator')}
          >
            Generate Now
          </Button>
        </div>
      </motion.div>

      {/* Bubble Glass Hero Stats — 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={formatNumber(stats.totalImagesProcessed)}
          label="Images Processed"
          sublabel="All time total"
          icon={<Image size={18} />}
          trend={{ value: 12.4, label: 'this month' }}
          color="blue"
          delay={0}
        />
        <StatCard
          value={formatNumber(stats.activeContributors)}
          label="Active Contributors"
          sublabel="Global network"
          icon={<Users size={18} />}
          trend={{ value: 8.1, label: 'this week' }}
          color="violet"
          delay={0.08}
        />
        <StatCard
          value={`${stats.averageSeoScore}`}
          label="Avg SEO Score"
          sublabel="Platform average"
          icon={<Award size={18} />}
          trend={{ value: 3.2, label: 'vs last month' }}
          color="emerald"
          delay={0.16}
        />
        <StatCard
          value={`${stats.productRating}/5`}
          label="Product Rating"
          sublabel="User satisfaction"
          icon={<Star size={18} />}
          trend={{ value: 0.2, label: 'improvement' }}
          color="amber"
          delay={0.24}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <GlassCard className="lg:col-span-2 p-5" delay={0.3}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Weekly Processing Volume</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Images & keywords generated per day</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                Images
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Score
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="colorImages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                contentStyle={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: 'var(--text-primary)',
                  backdropFilter: 'blur(12px)',
                }}
                cursor={{ stroke: 'var(--accent-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="images" stroke="var(--accent-primary)" strokeWidth={2} fill="url(#colorImages)" />
              <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Marketplace Distribution */}
        <GlassCard className="p-5" delay={0.35}>
          <div className="mb-5">
            <h3 className="font-semibold text-[var(--text-primary)]">Marketplace Usage</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Distribution by platform</p>
          </div>
          <div className="space-y-3">
            {MARKETPLACE_DATA.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-20 text-xs font-medium text-[var(--text-secondary)] shrink-0">{m.name}</div>
                <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                </div>
                <div className="text-xs font-semibold text-[var(--text-primary)] w-9 text-right">{m.value}%</div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <ShoppingBag size={14} className="text-[var(--accent-primary)]" />
              <span className="text-xs text-[var(--text-muted)]">Adobe Stock is your top platform</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Credits & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Credit Usage */}
        <GlassCard className="p-5" delay={0.4}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-primary)]">Credit Usage</h3>
            <Badge variant="info" size="sm">PRO Plan</Badge>
          </div>

          <div className="text-center py-4">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#creditGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 * (stats.creditsUsed / (stats.creditsUsed + stats.creditsRemaining)) }}
                  transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="creditGrad" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl font-bold gradient-text">{stats.creditsUsed}</div>
                <div className="text-[10px] text-[var(--text-muted)]">used</div>
              </div>
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--text-primary)]">{stats.creditsRemaining}</span> credits remaining
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Resets in 12 days</div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            icon={<Zap size={13} />}
          >
            Upgrade Plan
          </Button>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="lg:col-span-2 p-5" delay={0.45}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[var(--text-primary)]">Recent Activity</h3>
            <Button variant="ghost" size="xs" iconRight={<ArrowUpRight size={12} />}>
              View all
            </Button>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                  <Activity size={14} className="text-[var(--accent-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">{item.action}</p>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <Clock size={10} />
                    {item.time}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold" style={{
                    color: item.score >= 88 ? '#10B981' : item.score >= 80 ? '#F59E0B' : '#EF4444'
                  }}>
                    {item.score}
                  </span>
                  <Badge variant="default" size="sm">{item.marketplace}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-5" delay={0.5} animate={true}>
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Zap size={20} />, label: 'Single Generate', desc: 'Process one image', section: 'generator' as const, color: 'blue' },
            { icon: <Layers size={20} />, label: 'Batch Process', desc: 'Upload multiple files', section: 'bulk' as const, color: 'violet' },
            { icon: <ShoppingBag size={20} />, label: 'Marketplace', desc: 'Select platform', section: 'marketplace' as const, color: 'pink' },
            { icon: <Cpu size={20} />, label: 'Configure AI', desc: 'API key settings', section: 'settings' as const, color: 'emerald' },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.06 }}
              onClick={() => setActiveSection(action.section)}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all group text-left"
            >
              <div className={`p-2 rounded-xl transition-all ${
                action.color === 'blue' ? 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20' :
                action.color === 'violet' ? 'bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20' :
                action.color === 'pink' ? 'bg-pink-500/10 text-pink-500 group-hover:bg-pink-500/20' :
                'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20'
              }`}>
                {action.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{action.label}</div>
                <div className="text-xs text-[var(--text-muted)]">{action.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// Missing import
function Layers({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
