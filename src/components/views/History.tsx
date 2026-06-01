import { motion } from 'framer-motion';
import { History as HistoryIcon, Filter, Download, Search, Clock, Star } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SEOScoreRing } from '../ui/SEOScoreRing';

const MOCK_HISTORY = [
  {
    id: 'h1', imageName: 'mountain-lake-sunset.jpg',
    title: 'Vibrant Sunset Over Mountain Lake With Golden Reflections',
    tags: ['nature', 'sunset', 'lake', 'mountain', 'golden', 'sky', 'reflection'],
    seoScore: 91, marketplace: 'Adobe Stock', provider: 'GPT-4o',
    creditsUsed: 1, time: '5 minutes ago',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
  },
  {
    id: 'h2', imageName: 'business-team-meeting.jpg',
    title: 'Professional Business Team Collaborating In Modern Office',
    tags: ['business', 'team', 'office', 'professional', 'meeting', 'corporate'],
    seoScore: 87, marketplace: 'Shutterstock', provider: 'Gemini 2.5',
    creditsUsed: 1, time: '23 minutes ago',
    preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80&h=80&fit=crop',
  },
  {
    id: 'h3', imageName: 'abstract-geometric-art.png',
    title: 'Abstract Geometric Pattern With Bold Colorful Shapes',
    tags: ['abstract', 'geometric', 'pattern', 'colorful', 'art', 'modern', 'background'],
    seoScore: 84, marketplace: 'Freepik', provider: 'Grok 4',
    creditsUsed: 1, time: '1 hour ago',
    preview: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=80&h=80&fit=crop',
  },
  {
    id: 'h4', imageName: 'fresh-vegetables-table.jpg',
    title: 'Fresh Organic Vegetables Arranged On Rustic Wooden Table',
    tags: ['food', 'vegetables', 'organic', 'fresh', 'healthy', 'cooking', 'kitchen'],
    seoScore: 89, marketplace: 'iStock', provider: 'GPT-4o',
    creditsUsed: 1, time: '2 hours ago',
    preview: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&h=80&fit=crop',
  },
  {
    id: 'h5', imageName: 'city-night-neon.jpg',
    title: 'Dynamic Urban Cityscape At Night With Vibrant Neon Lights',
    tags: ['city', 'night', 'urban', 'neon', 'lights', 'building', 'street', 'downtown'],
    seoScore: 93, marketplace: 'Adobe Stock', provider: 'GPT-4o',
    creditsUsed: 1, time: '3 hours ago',
    preview: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=80&h=80&fit=crop',
  },
];

export function History() {
  return (
    <div className="p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Generation History</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">All your previously generated metadata outputs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[var(--border-strong)] text-sm text-[var(--text-muted)] w-48">
            <Search size={14} />
            <span className="text-xs">Search history...</span>
          </div>
          <Button variant="outline" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <Button variant="gradient" size="sm" icon={<Download size={13} />}>Export All</Button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Generations', value: '247', color: 'var(--accent-primary)' },
          { label: 'This Month', value: '48', color: '#10B981' },
          { label: 'Avg SEO Score', value: '88.8', color: '#F59E0B' },
          { label: 'Credits Used', value: '247', color: '#7C3AED' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bubble-glass rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* History List */}
      <GlassCard className="p-0 overflow-hidden" delay={0.2}>
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <HistoryIcon size={14} className="text-[var(--accent-primary)]" />
            Recent Generations
          </h3>
          <Badge variant="default" size="sm">{MOCK_HISTORY.length} entries</Badge>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {MOCK_HISTORY.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="flex items-start gap-4 p-5 hover:bg-[var(--bg-tertiary)] transition-all group"
            >
              {/* Preview */}
              <img
                src={item.preview}
                alt={item.imageName}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[var(--border)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><rect fill='%23334155' width='56' height='56' rx='8'/><text fill='%2364748b' font-size='20' text-anchor='middle' x='28' y='36'>📷</text></svg>`;
                }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{item.imageName}</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5 leading-snug line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                  <SEOScoreRing score={item.seoScore} size={52} showLabel={false} />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {item.tags.slice(0, 5).map(tag => (
                    <span key={tag} className="tag-chip text-[10px] px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                  {item.tags.length > 5 && (
                    <span className="text-[10px] text-[var(--text-muted)] px-2 py-0.5">+{item.tags.length - 5} more</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2.5 text-[10px] text-[var(--text-muted)] flex-wrap">
                  <span className="flex items-center gap-1"><Clock size={9} /> {item.time}</span>
                  <span className="flex items-center gap-1"><Star size={9} /> {item.marketplace}</span>
                  <span className="flex items-center gap-1">via {item.provider}</span>
                  <span>{item.creditsUsed} credit used</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button size="xs" variant="ghost">Reuse</Button>
                <Button size="xs" variant="ghost" icon={<Download size={10} />}>Export</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
