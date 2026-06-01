import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Search, Menu, X, ChevronRight, HelpCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

const SECTION_LABELS: Record<string, { title: string; desc: string }> = {
  dashboard: { title: 'Dashboard', desc: 'Platform overview & analytics' },
  generator: { title: 'AI Generator', desc: 'Single image metadata generation' },
  bulk: { title: 'Bulk Suite', desc: 'Parallel batch processing pipeline' },
  marketplace: { title: 'Marketplace Engine', desc: 'Platform-specific optimization profiles' },
  history: { title: 'Generation History', desc: 'All your past metadata outputs' },
  templates: { title: 'Prompt Templates', desc: 'Custom reusable prompt library' },
  settings: { title: 'Settings', desc: 'API keys, preferences & integrations' },
  billing: { title: 'Billing & Plans', desc: 'Subscription management & credits' },
  admin: { title: 'Admin Portal', desc: 'System logs & user controls' },
};

export function TopBar() {
  const { isDark, toggleTheme, activeSection, sidebarOpen, setSidebarOpen, user } = useAppStore();
  const section = SECTION_LABELS[activeSection] || SECTION_LABELS.dashboard;

  return (
    <header className="h-16 glass border-b border-[var(--border)] flex items-center px-6 gap-4 shrink-0 relative z-10">
      {/* Mobile menu */}
      <button
        className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-[var(--text-muted)] hidden sm:inline">StockSEO AI</span>
        <ChevronRight size={12} className="text-[var(--text-muted)] hidden sm:inline" />
        <div>
          <h1 className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{section.title}</h1>
          <p className="text-[10px] text-[var(--text-muted)] leading-tight hidden sm:block">{section.desc}</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl input-glass text-sm text-[var(--text-muted)] w-52 cursor-pointer hover:border-[var(--accent-primary)] transition-all">
        <Search size={14} />
        <span className="text-xs">Search anything...</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--border)] text-[var(--text-muted)] font-mono">⌘K</kbd>
      </div>

      {/* Theme toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={cn(
          'relative w-9 h-9 rounded-xl flex items-center justify-center transition-all',
          'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          'border border-[var(--border)]',
        )}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <AnimatedIcon isDark={isDark} />
      </motion.button>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] transition-all">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-primary)] ring-2 ring-[var(--bg-base)] pulse-dot" />
      </button>

      {/* Help */}
      <button className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] transition-all">
        <HelpCircle size={16} />
      </button>

      {/* Avatar */}
      {user && (
        <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
    </header>
  );
}

function AnimatedIcon({ isDark }: { isDark: boolean }) {
  return isDark ? <Moon size={16} /> : <Sun size={16} />;
}
