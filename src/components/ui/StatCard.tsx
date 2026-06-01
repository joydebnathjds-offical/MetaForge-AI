import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'blue' | 'pink' | 'violet' | 'emerald' | 'amber';
  delay?: number;
  className?: string;
}

const colorMap = {
  blue: { glow: 'rgba(0,123,255,0.15)', text: '#007BFF', bg: 'rgba(0,123,255,0.08)' },
  pink: { glow: 'rgba(255,78,173,0.15)', text: '#FF4EAD', bg: 'rgba(255,78,173,0.08)' },
  violet: { glow: 'rgba(124,58,237,0.15)', text: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  emerald: { glow: 'rgba(16,185,129,0.15)', text: '#10B981', bg: 'rgba(16,185,129,0.08)' },
  amber: { glow: 'rgba(245,158,11,0.15)', text: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
};

export function StatCard({
  value, label, sublabel, icon, trend, color = 'blue', delay = 0, className,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={cn('bubble-glass rounded-2xl p-6 relative overflow-hidden group', className)}
      style={{ boxShadow: `0 8px 32px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.06)` }}
    >
      {/* Background glow orb */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"
        style={{ background: colors.glow }}
      />

      <div className="relative z-10">
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: colors.bg, color: colors.text }}
          >
            {icon}
          </div>
        )}

        <div
          className="text-3xl font-bold tracking-tight mb-1"
          style={{ color: colors.text }}
        >
          {value}
        </div>

        <div className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
          {label}
        </div>

        {sublabel && (
          <div className="text-xs text-[var(--text-muted)]">{sublabel}</div>
        )}

        {trend && (
          <div className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            trend.value >= 0
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400',
          )}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
    </motion.div>
  );
}
