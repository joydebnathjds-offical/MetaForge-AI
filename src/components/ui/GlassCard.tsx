import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function GlassCard({
  children, className, hover = false, glow = false,
  animate = true, delay = 0, onClick,
}: GlassCardProps) {
  if (!animate) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'bubble-glass rounded-2xl',
          hover && 'glass-hover cursor-pointer',
          glow && 'glow-accent',
          onClick && 'cursor-pointer',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'bubble-glass rounded-2xl',
        hover && 'glass-hover cursor-pointer',
        glow && 'glow-accent',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
