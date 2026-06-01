import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Users, Activity, AlertTriangle, CheckCircle2,
  BarChart3, Settings, RefreshCw, Eye, Ban, Crown,
  Database, Cpu, Globe, Clock, TrendingUp,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

const MOCK_USERS = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@photo.co', tier: 'PRO', credits: 450, status: 'active', joined: '2024-03-12' },
  { id: 'u2', name: 'Marco Rivera', email: 'marco@stock.io', tier: 'ENTERPRISE', credits: 4800, status: 'active', joined: '2024-01-05' },
  { id: 'u3', name: 'Emma Wilson', email: 'emma@creative.com', tier: 'FREE', credits: 12, status: 'active', joined: '2024-05-22' },
  { id: 'u4', name: 'James Park', email: 'james@imagery.net', tier: 'PRO', credits: 0, status: 'suspended', joined: '2024-02-14' },
  { id: 'u5', name: 'Aria Patel', email: 'aria@shuttr.io', tier: 'PRO', credits: 225, status: 'active', joined: '2024-04-01' },
];

const SYSTEM_LOGS = [
  { id: 'l1', level: 'info', message: 'Batch job completed for user sarah@photo.co (48 images)', time: '2 min ago' },
  { id: 'l2', level: 'success', message: 'OpenAI GPT-4o API connection verified', time: '8 min ago' },
  { id: 'l3', level: 'warning', message: 'Gemini API rate limit approaching (85% of quota)', time: '15 min ago' },
  { id: 'l4', level: 'info', message: 'New user registered: emma@creative.com', time: '32 min ago' },
  { id: 'l5', level: 'error', message: 'Failed batch export for job ID batch_221 (timeout)', time: '1h ago' },
  { id: 'l6', level: 'info', message: 'Credit top-up processed: 500 credits for marco@stock.io', time: '2h ago' },
  { id: 'l7', level: 'success', message: 'Database backup completed (Supabase)', time: '6h ago' },
];

const SYSTEM_METRICS = [
  { label: 'Total Users', value: '12,483', icon: <Users size={16} />, change: '+142 this week', positive: true },
  { label: 'API Calls Today', value: '48,291', icon: <Activity size={16} />, change: '+18% vs yesterday', positive: true },
  { label: 'Avg Response Time', value: '1.24s', icon: <Clock size={16} />, change: '-0.3s improvement', positive: true },
  { label: 'Error Rate', value: '0.08%', icon: <AlertTriangle size={16} />, change: '-0.02% this week', positive: true },
];

const GLOBAL_INSTRUCTIONS = `You are StockSEO AI's multimodal vision engine. Analyze the provided stock image and generate professionally optimized metadata for stock media submission.

Guidelines:
1. Title: Descriptive, keyword-rich, avoid repetition
2. Description: Natural language with SEO context clues
3. Tags: Ordered by relevance (most specific → broad)
4. Always classify commercial vs editorial accurately
5. Category must align with marketplace taxonomy
6. Prioritize searchability over creativity`;

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'system'>('overview');
  const [systemPrompt, setSystemPrompt] = useState(GLOBAL_INSTRUCTIONS);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
    { id: 'users', label: 'Users', icon: <Users size={14} /> },
    { id: 'logs', label: 'System Logs', icon: <Activity size={14} /> },
    { id: 'system', label: 'System Config', icon: <Settings size={14} /> },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck size={22} className="text-red-400" />
            Admin Portal
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Super-user system controls, monitoring, and user management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger" size="md">
            <ShieldCheck size={11} /> ADMIN ACCESS
          </Badge>
          <Button variant="outline" size="sm" icon={<RefreshCw size={13} />}>Refresh</Button>
        </div>
      </motion.div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 p-1 rounded-2xl glass border border-[var(--border)] w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'btn-gradient text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SYSTEM_METRICS.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bubble-glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2 text-[var(--accent-primary)]">{m.icon}</div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">{m.value}</div>
                <div className="text-xs font-medium text-[var(--text-secondary)]">{m.label}</div>
                <div className={`text-[10px] mt-1 ${m.positive ? 'text-emerald-400' : 'text-red-400'}`}>{m.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Provider Health */}
          <GlassCard className="p-5" delay={0.3}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Cpu size={14} className="text-[var(--accent-primary)]" /> AI Provider Health
            </h3>
            <div className="space-y-3">
              {[
                { name: 'OpenAI GPT-4o', latency: '1.1s', status: 'healthy', usage: 62 },
                { name: 'Google Gemini 2.5', latency: '1.8s', status: 'healthy', usage: 28 },
                { name: 'Grok 4', latency: '2.3s', status: 'warning', usage: 7 },
                { name: 'Claude 3.5', latency: '1.5s', status: 'healthy', usage: 3 },
              ].map(p => (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: p.status === 'healthy' ? '#10B981' : p.status === 'warning' ? '#F59E0B' : '#EF4444' }} />
                  <span className="text-sm text-[var(--text-secondary)] w-40 shrink-0">{p.name}</span>
                  <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${p.usage}%` }} />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] w-8 text-right">{p.usage}%</span>
                  <span className="text-xs text-[var(--text-muted)] w-12 text-right font-mono">{p.latency}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <GlassCard className="p-5" delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">User Management</h3>
            <input
              placeholder="Search users..."
              className="input-glass px-3 py-1.5 rounded-xl text-sm w-48"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['User', 'Email', 'Tier', 'Credits', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--text-muted)] pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {MOCK_USERS.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium text-[var(--text-primary)] whitespace-nowrap">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-[var(--text-muted)] text-xs">{u.email}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={u.tier === 'ENTERPRISE' ? 'gradient' : u.tier === 'PRO' ? 'info' : 'default'} size="sm">
                        {u.tier === 'ENTERPRISE' && <Crown size={9} />}
                        {u.tier}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--text-primary)]">{u.credits}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'} size="sm">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                          <Eye size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400">
                          <Ban size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-amber-500/10 text-[var(--text-muted)] hover:text-amber-400">
                          <Crown size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <GlassCard className="p-5" delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">System Logs</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                Live
              </span>
              <Button size="xs" variant="ghost" icon={<RefreshCw size={11} />}>Refresh</Button>
            </div>
          </div>
          <div className="space-y-2 font-mono text-xs">
            {SYSTEM_LOGS.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
              >
                <span className={cn(
                  'shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase',
                  log.level === 'error' ? 'bg-red-500/15 text-red-400' :
                  log.level === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                  log.level === 'success' ? 'bg-emerald-500/15 text-emerald-400' :
                  'bg-blue-500/15 text-blue-400',
                )}>
                  {log.level}
                </span>
                <span className="flex-1 text-[var(--text-secondary)]">{log.message}</span>
                <span className="text-[var(--text-muted)] shrink-0 text-[10px]">{log.time}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* System Config Tab */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <GlassCard className="p-5" delay={0.1}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Globe size={14} className="text-[var(--accent-primary)]" />
              Global System Instruction Override
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              This prompt is prepended to all AI generation requests across all users and providers.
            </p>
            <textarea
              className="input-glass w-full p-4 rounded-xl text-sm font-mono resize-none leading-relaxed"
              rows={10}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <Button variant="gradient" size="sm" icon={<CheckCircle2 size={13} />}>
                Save Global Instruction
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSystemPrompt(GLOBAL_INSTRUCTIONS)}>
                Reset to Default
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-5" delay={0.15}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Database size={14} className="text-[var(--accent-primary)]" />
              Database Controls
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Run DB Backup', icon: <Database size={14} />, variant: 'outline' as const },
                { label: 'Clear Cache', icon: <RefreshCw size={14} />, variant: 'outline' as const },
                { label: 'Flush Logs', icon: <Activity size={14} />, variant: 'outline' as const },
                { label: 'Reset Credits All', icon: <Cpu size={14} />, variant: 'danger' as const },
                { label: 'Maintenance Mode', icon: <AlertTriangle size={14} />, variant: 'danger' as const },
                { label: 'Export All Data', icon: <TrendingUp size={14} />, variant: 'outline' as const },
              ].map(action => (
                <Button key={action.label} variant={action.variant} size="sm" icon={action.icon} className="justify-center">
                  {action.label}
                </Button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
