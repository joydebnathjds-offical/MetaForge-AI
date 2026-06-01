import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wand2, Layers, ShoppingBag, History,
  FileText, Settings, CreditCard, ShieldCheck, ChevronLeft,
  ChevronRight, Zap, Star, Crown, Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { NavSection } from '../../types';
import { cn } from '../../utils/cn';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'new' | 'pro' | 'hot';
  dividerBefore?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'generator', label: 'AI Generator', icon: <Wand2 size={18} />, badge: 'AI', badgeVariant: 'new' },
  { id: 'bulk', label: 'Bulk Suite', icon: <Layers size={18} />, badge: 'PRO', badgeVariant: 'pro' },
  { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag size={18} /> },
  { id: 'history', label: 'History', icon: <History size={18} /> },
  { id: 'templates', label: 'Templates', icon: <FileText size={18} />, dividerBefore: true },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> },
  { id: 'admin', label: 'Admin Portal', icon: <ShieldCheck size={18} />, dividerBefore: true, badge: 'ADMIN', badgeVariant: 'hot' },
];

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  pro: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  hot: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

const TIER_CONFIG = {
  FREE: { icon: <Zap size={12} />, color: 'text-[var(--text-muted)]', bg: 'bg-[var(--bg-tertiary)]' },
  PRO: { icon: <Star size={12} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ENTERPRISE: { icon: <Crown size={12} />, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ADMIN: { icon: <ShieldCheck size={12} />, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen, user } = useAppStore();

  const tier = user?.tier || 'FREE';
  const tierConfig = TIER_CONFIG[tier];

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 68 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sidebar relative z-20 flex flex-col h-screen shrink-0 border-r border-[var(--border)]"
      style={{ overflow: 'hidden' }}
    >
      {/* Logo Row */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-[var(--border)] shrink-0">
        {/* Logo icon */}
        <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shrink-0 shadow-lg">
          <Sparkles size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-bold text-sm text-[var(--text-primary)] leading-tight">StockSEO AI</span>
              <span className="text-[10px] text-[var(--text-muted)] leading-tight">Enterprise Platform</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'ml-auto w-6 h-6 rounded-lg flex items-center justify-center',
            'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
            'hover:bg-[var(--bg-tertiary)] transition-all shrink-0',
          )}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <div key={item.id}>
            {item.dividerBefore && (
              <div className="my-2 mx-2 border-t border-[var(--border)]" />
            )}
            <NavButton
              item={item}
              isActive={activeSection === item.id}
              collapsed={!sidebarOpen}
              onClick={() => setActiveSection(item.id)}
            />
          </div>
        ))}
      </nav>

      {/* Credits Bar */}
      <AnimatePresence>
        {sidebarOpen && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-3"
          >
            <div className="bubble-glass rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">Credits</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {user.credits - user.creditsUsed} / {user.credits}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((user.credits - user.creditsUsed) / user.credits) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--accent-gradient)' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile */}
      {user && (
        <div className="p-3 border-t border-[var(--border)] shrink-0">
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center shrink-0 text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0 flex-1"
                >
                  <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full', tierConfig.bg, tierConfig.color)}>
                      {tierConfig.icon}
                      {tier}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

function NavButton({
  item, isActive, collapsed, onClick,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
        'transition-all duration-150 group',
        collapsed ? 'justify-center' : '',
        isActive
          ? 'text-white shadow-lg'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
      )}
      style={isActive ? { background: 'var(--accent-gradient)' } : {}}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 rounded-xl"
          style={{ background: 'var(--accent-gradient)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      <span className="relative z-10 shrink-0">{item.icon}</span>

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 flex-1 text-left truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {!collapsed && item.badge && (
        <span className={cn(
          'relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0',
          isActive ? 'bg-white/20 text-white' : BADGE_STYLES[item.badgeVariant || 'new'],
        )}>
          {item.badge}
        </span>
      )}
    </button>
  );
}
