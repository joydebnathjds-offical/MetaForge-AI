import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './components/views/Dashboard';
import { Generator } from './components/views/Generator';
import { BulkSuite } from './components/views/BulkSuite';
import { MarketplaceEngine } from './components/views/MarketplaceEngine';
import { History } from './components/views/History';
import { Templates } from './components/views/Templates';
import { Settings } from './components/views/Settings';
import { Billing } from './components/views/Billing';
import { AdminPortal } from './components/views/AdminPortal';

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function ActiveView() {
  const { activeSection } = useAppStore();

  const views: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    generator: <Generator />,
    bulk: <BulkSuite />,
    marketplace: <MarketplaceEngine />,
    history: <History />,
    templates: <Templates />,
    settings: <Settings />,
    billing: <Billing />,
    admin: <AdminPortal />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex-1 overflow-y-auto"
      >
        {views[activeSection] || <Dashboard />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { isDark } = useAppStore();

  // Sync theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="animated-bg min-h-screen flex overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-strong)',
            borderRadius: '14px',
            backdropFilter: 'blur(20px)',
            fontSize: '13px',
          },
        }}
      />

      {/* Background mesh gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-[0.04]"
          style={{
            top: '-200px',
            right: '-200px',
            background: 'var(--accent-gradient)',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.03]"
          style={{
            bottom: '-150px',
            left: '-100px',
            background: 'var(--accent-gradient)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(var(--text-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Sidebar */}
      <div className="relative z-20 shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <ActiveView />
      </div>
    </div>
  );
}
