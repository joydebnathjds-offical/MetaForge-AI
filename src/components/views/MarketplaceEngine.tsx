import { motion } from 'framer-motion';
import { Check, Star, Info, ChevronRight, Zap, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { MarketplaceType } from '../../types';
import { cn } from '../../utils/cn';

interface MarketplaceProfile {
  id: MarketplaceType;
  name: string;
  logo: string;
  color: string;
  gradient: string;
  titleRange: string;
  descRange: string;
  tagsRange: string;
  keyFeatures: string[];
  algorithm: string;
  acceptsCommercial: boolean;
  acceptsEditorial: boolean;
  rating: number;
  contributors: string;
}

const MARKETPLACE_PROFILES: MarketplaceProfile[] = [
  {
    id: 'adobe_stock',
    name: 'Adobe Stock',
    logo: '🅰️',
    color: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000, #FF6B6B)',
    titleRange: '70–200 chars',
    descRange: '100–500 chars',
    tagsRange: '49 tags max',
    keyFeatures: [
      'Keyword relevance scoring', 'Adobe AI visual matching', 'Creative Cloud integration',
      'Editorial & commercial split', 'Vector + bitmap support',
    ],
    algorithm: 'Adobe Visual Search v3 with semantic clustering and Adobe Firefly cross-reference.',
    acceptsCommercial: true,
    acceptsEditorial: true,
    rating: 4.8,
    contributors: '5.2M+',
  },
  {
    id: 'shutterstock',
    name: 'Shutterstock',
    logo: '📷',
    color: '#EE3423',
    gradient: 'linear-gradient(135deg, #EE3423, #FF7F56)',
    titleRange: '5–100 chars',
    descRange: '0–200 chars',
    tagsRange: '50 tags max',
    keyFeatures: [
      'Single-phrase precision titles', 'AI relevance engine', 'Trend-based keyword suggestions',
      'Contributor earning tiers', 'Footage + audio support',
    ],
    algorithm: 'Shutterstock CLIP-based embedding model with popularity-weighted keyword scoring.',
    acceptsCommercial: true,
    acceptsEditorial: true,
    rating: 4.6,
    contributors: '2.1M+',
  },
  {
    id: 'freepik',
    name: 'Freepik',
    logo: '🎨',
    color: '#1273EB',
    gradient: 'linear-gradient(135deg, #1273EB, #00C4CC)',
    titleRange: '40–120 chars',
    descRange: '80–300 chars',
    tagsRange: '30 tags max',
    keyFeatures: [
      'Design-first keyword strategy', 'Vector + raster workflows', 'Freepik AI style tags',
      'Multi-license support', 'Spanish/EN bilingual optimization',
    ],
    algorithm: 'Freepik Semantic Engine with design-context weighting and style-tag layering.',
    acceptsCommercial: true,
    acceptsEditorial: false,
    rating: 4.5,
    contributors: '6.8M+',
  },
  {
    id: 'istock',
    name: 'iStock / Getty Images',
    logo: '🖼️',
    color: '#009999',
    gradient: 'linear-gradient(135deg, #009999, #00D4AA)',
    titleRange: '50–150 chars',
    descRange: '100–400 chars',
    tagsRange: '50 tags max',
    keyFeatures: [
      'Getty quality standards', 'EXIF + caption sync', 'Enterprise licensing pipeline',
      'Exclusive contributor tiers', 'Model release tracking',
    ],
    algorithm: 'Getty Exclusive + iStock shared pool with quality-gate semantic validation.',
    acceptsCommercial: true,
    acceptsEditorial: true,
    rating: 4.7,
    contributors: '200K+',
  },
  {
    id: 'dreamstime',
    name: 'Dreamstime',
    logo: '💭',
    color: '#0A6E37',
    gradient: 'linear-gradient(135deg, #0A6E37, #00B862)',
    titleRange: '30–100 chars',
    descRange: '50–250 chars',
    tagsRange: '25 tags max',
    keyFeatures: [
      'Long-tail keyword focus', 'Category tree optimization', 'Extended licensing',
      'Print-on-demand sync', 'Referral program integration',
    ],
    algorithm: 'Dreamstime proprietary ranking with category-tree traversal and long-tail amplification.',
    acceptsCommercial: true,
    acceptsEditorial: true,
    rating: 4.2,
    contributors: '120K+',
  },
  {
    id: 'alamy',
    name: 'Alamy',
    logo: '🌐',
    color: '#4B2991',
    gradient: 'linear-gradient(135deg, #4B2991, #7C3AED)',
    titleRange: '60–200 chars',
    descRange: '100–1000 chars',
    tagsRange: '50 tags max',
    keyFeatures: [
      'Editorial-first platform', 'Rich description support', 'Global licensing reach',
      'High royalty model (50%)', 'News & archive collections',
    ],
    algorithm: 'Alamy contextual search engine with editorial-weighted relevance and caption NLP.',
    acceptsCommercial: true,
    acceptsEditorial: true,
    rating: 4.4,
    contributors: '75K+',
  },
];

export function MarketplaceEngine() {
  const { selectedMarketplace, setMarketplace, updateSettings } = useAppStore();
  const selected = MARKETPLACE_PROFILES.find(m => m.id === selectedMarketplace) || MARKETPLACE_PROFILES[0];

  const handleSelect = (m: MarketplaceProfile) => {
    setMarketplace(m.id);
    updateSettings({
      marketplace: m.id,
      titleMaxChars: parseInt(m.titleRange.split('–')[1]) || 100,
      tagsLimit: parseInt(m.tagsRange) || 40,
    });
  };

  return (
    <div className="p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Marketplace Engine</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Select your target platform to apply algorithmically-tuned metadata generation profiles
          </p>
        </div>
        <Badge variant="info" size="md">
          <Globe size={11} />
          6 Platforms Supported
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Platform Grid */}
        <div className="lg:col-span-2 space-y-3">
          {MARKETPLACE_PROFILES.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => handleSelect(m)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left',
                selectedMarketplace === m.id
                  ? 'border-[var(--accent-primary)]/50 shadow-lg'
                  : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-tertiary)]',
                'bubble-glass',
              )}
              style={selectedMarketplace === m.id ? {
                background: `linear-gradient(135deg, ${m.color}10, ${m.color}05)`,
                borderColor: `${m.color}40`,
              } : {}}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                style={{ background: `${m.color}15` }}
              >
                {m.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[var(--text-primary)]">{m.name}</span>
                  {selectedMarketplace === m.id && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={9} className="text-white" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-[var(--text-muted)]">{m.contributors} contributors</span>
                  <span className="flex items-center gap-0.5 text-amber-400 text-xs">
                    <Star size={10} fill="currentColor" />
                    {m.rating}
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)] shrink-0" />
            </motion.button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Header Card */}
            <div className="bubble-glass rounded-2xl p-6" style={{
              background: `linear-gradient(135deg, ${selected.color}12, ${selected.color}05)`,
              borderColor: `${selected.color}25`,
            }}>
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                  style={{ background: selected.gradient }}
                >
                  {selected.logo}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{selected.name}</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={selected.acceptsCommercial ? 'success' : 'default'} size="sm">
                      {selected.acceptsCommercial ? '✓' : '×'} Commercial
                    </Badge>
                    <Badge variant={selected.acceptsEditorial ? 'info' : 'default'} size="sm">
                      {selected.acceptsEditorial ? '✓' : '×'} Editorial
                    </Badge>
                    <Badge variant="gradient" size="sm">
                      <Star size={9} fill="currentColor" className="text-amber-400" />
                      {selected.rating}/5
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="gradient"
                  size="sm"
                  icon={<Zap size={13} />}
                  onClick={() => handleSelect(selected)}
                >
                  {selectedMarketplace === selected.id ? 'Active Profile' : 'Apply Profile'}
                </Button>
              </div>
            </div>

            {/* Metadata Requirements */}
            <GlassCard className="p-5" animate={false}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Info size={14} className="text-[var(--accent-primary)]" />
                Metadata Requirements
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Title', range: selected.titleRange, color: '#007BFF' },
                  { label: 'Description', range: selected.descRange, color: '#10B981' },
                  { label: 'Keywords', range: selected.tagsRange, color: '#F59E0B' },
                ].map(req => (
                  <div
                    key={req.label}
                    className="p-3 rounded-xl text-center"
                    style={{ background: `${req.color}10`, border: `1px solid ${req.color}20` }}
                  >
                    <div className="text-xs text-[var(--text-muted)] mb-1">{req.label}</div>
                    <div className="text-sm font-bold" style={{ color: req.color }}>{req.range}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Key Features */}
            <GlassCard className="p-5" animate={false}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Platform Features</h4>
              <ul className="space-y-2.5">
                {selected.keyFeatures.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${selected.color}20`, color: selected.color }}>
                      <Check size={10} />
                    </div>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>

            {/* Algorithm Info */}
            <GlassCard className="p-5" animate={false}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <Zap size={14} style={{ color: selected.color }} />
                Algorithm Profile
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selected.algorithm}</p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
