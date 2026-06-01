import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Wand2, Copy, Edit3, RefreshCw, Check,
  FileImage, ChevronDown, Lock, Unlock, Tag, Type, AlignLeft,
  ShoppingBag, Cpu, Sparkles, Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SEOScoreRing } from '../ui/SEOScoreRing';
import type { ImageAsset, GeneratedMetadata } from '../../types';
import { cn } from '../../utils/cn';

const TITLE_CHAR_OPTIONS = [80, 100, 120, 150];
const DESC_CHAR_OPTIONS = [150, 200, 300, 400];
const TAGS_LIMIT_OPTIONS = [30, 40, 50];

const MARKETPLACE_OPTIONS = [
  { value: 'adobe_stock', label: 'Adobe Stock', color: '#FF0000' },
  { value: 'shutterstock', label: 'Shutterstock', color: '#EE3423' },
  { value: 'freepik', label: 'Freepik', color: '#1273EB' },
  { value: 'istock', label: 'iStock', color: '#009999' },
  { value: 'dreamstime', label: 'Dreamstime', color: '#0A6E37' },
  { value: 'alamy', label: 'Alamy', color: '#4B2991' },
];

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function Generator() {
  const {
    assets, addAssets, removeAsset,
    generateMetadata, isGenerating,
    settings, updateSettings,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const activeAsset = assets[0] || null;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'].includes(f.type)
    );
    if (files.length > 0) addAssets([files[0]]);
  }, [addAssets]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) addAssets([files[0]]);
    e.target.value = '';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">AI Generator</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Upload an image and generate optimized stock media metadata</p>
        </div>
        <div className="flex items-center gap-2">
          <MarketplaceSelector value={settings.marketplace} onChange={(v) => updateSettings({ marketplace: v as any })} />
          <ModelSelector />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Upload + Preview Panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Drop Zone */}
          <GlassCard className="p-0 overflow-hidden" delay={0.1}>
            {activeAsset ? (
              <AssetPreview asset={activeAsset} onRemove={() => { removeAsset(activeAsset.id); }} />
            ) : (
              <DropZone
                dragActive={dragActive}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onClick={() => fileInputRef.current?.click()}
              />
            )}
          </GlassCard>

          {/* Settings Panel */}
          <GlassCard className="p-5" delay={0.15}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Cpu size={15} className="text-[var(--accent-primary)]" />
              Generation Parameters
            </h3>

            <div className="space-y-5">
              {/* Title Length */}
              <SliderSetting
                label="Title Max Characters"
                value={settings.titleMaxChars}
                options={TITLE_CHAR_OPTIONS}
                onChange={(v) => updateSettings({ titleMaxChars: v })}
                icon={<Type size={13} />}
              />

              {/* Description Length */}
              <SliderSetting
                label="Description Max Characters"
                value={settings.descriptionMaxChars}
                options={DESC_CHAR_OPTIONS}
                onChange={(v) => updateSettings({ descriptionMaxChars: v })}
                icon={<AlignLeft size={13} />}
              />

              {/* Tags Limit */}
              <SliderSetting
                label="Keywords Limit"
                value={settings.tagsLimit}
                options={TAGS_LIMIT_OPTIONS}
                onChange={(v) => updateSettings({ tagsLimit: v })}
                icon={<Tag size={13} />}
              />
            </div>
          </GlassCard>

          {/* Generate Button */}
          {activeAsset && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                variant="gradient"
                size="lg"
                className="w-full justify-center text-base font-bold shadow-xl"
                icon={<Sparkles size={18} />}
                loading={isGenerating || activeAsset.status === 'analyzing'}
                onClick={() => generateMetadata(activeAsset.id)}
                disabled={activeAsset.status === 'complete' && !!activeAsset.metadata}
              >
                {activeAsset.status === 'analyzing'
                  ? `Analyzing... ${activeAsset.progress}%`
                  : activeAsset.status === 'complete'
                  ? 'Regenerate All'
                  : 'Generate SEO Metadata'}
              </Button>
              {activeAsset.status === 'analyzing' && (
                <div className="mt-2 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full progress-bar-animated rounded-full"
                    animate={{ width: `${activeAsset.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Metadata Output Panel */}
        <div className="xl:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {!activeAsset ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-80 bubble-glass rounded-2xl"
              >
                <FileImage size={48} className="text-[var(--text-muted)] mb-4" strokeWidth={1} />
                <p className="text-sm font-medium text-[var(--text-secondary)]">Upload an image to get started</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Supports JPG, PNG, WEBP, TIFF</p>
              </motion.div>
            ) : activeAsset.status === 'queued' ? (
              <motion.div
                key="queued"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-80 bubble-glass rounded-2xl gap-3"
              >
                <Wand2 size={40} className="text-[var(--accent-primary)]" strokeWidth={1.5} />
                <p className="text-sm font-medium text-[var(--text-secondary)]">Image ready — click Generate to proceed</p>
              </motion.div>
            ) : activeAsset.status === 'analyzing' ? (
              <AnalyzingState progress={activeAsset.progress} />
            ) : activeAsset.metadata ? (
              <MetadataOutput asset={activeAsset} metadata={activeAsset.metadata} />
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/tiff"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ─── Sub-Components ────────────────────────────────────────────────────────

function DropZone({ dragActive, onDrop, onDragOver, onDragLeave, onClick }: {
  dragActive: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      animate={{ borderColor: dragActive ? 'var(--accent-primary)' : 'var(--border-strong)' }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-10 cursor-pointer transition-all min-h-[280px]',
        'border-2 border-dashed rounded-2xl',
        dragActive && 'bg-[var(--accent-primary)]/5',
      )}
      style={{ borderColor: dragActive ? 'var(--accent-primary)' : 'var(--border-strong)' }}
    >
      <motion.div
        animate={{ y: dragActive ? -6 : 0, scale: dragActive ? 1.1 : 1 }}
        className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center shadow-xl"
      >
        <Upload size={28} className="text-white" />
      </motion.div>
      <div className="text-center">
        <p className="font-semibold text-[var(--text-primary)]">
          {dragActive ? 'Drop to upload' : 'Upload Image'}
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Drag & drop or click to browse</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">JPG · PNG · WEBP · TIFF · Max 50MB</p>
      </div>
    </motion.div>
  );
}

function AssetPreview({ asset, onRemove }: { asset: ImageAsset; onRemove: () => void }) {
  return (
    <div className="relative">
      <img
        src={asset.previewUrl}
        alt={asset.name}
        className="w-full h-52 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-red-500/70 transition-all"
      >
        <X size={14} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" size="sm" className="bg-black/50 text-white border-white/20">
            {asset.extension}
          </Badge>
          {asset.width && (
            <Badge variant="default" size="sm" className="bg-black/50 text-white border-white/20">
              {asset.width}×{asset.height}
            </Badge>
          )}
          <Badge variant="default" size="sm" className="bg-black/50 text-white border-white/20">
            {formatSize(asset.size)}
          </Badge>
        </div>
        <p className="text-white/90 text-xs mt-1.5 truncate">{asset.name}</p>
      </div>
    </div>
  );
}

function AnalyzingState({ progress }: { progress: number }) {
  const steps = [
    'Reading image vectors...',
    'Running multimodal vision analysis...',
    'Extracting semantic context...',
    'Generating optimized metadata...',
    'Calculating SEO scores...',
  ];
  const stepIdx = Math.floor((progress / 100) * steps.length);

  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="bubble-glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[320px] gap-6"
    >
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="var(--border)" strokeWidth="6" />
          <motion.circle
            cx="40" cy="40" r="35" fill="none"
            stroke="url(#analyzeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={220}
            animate={{ strokeDashoffset: 220 - (220 * progress / 100) }}
            transition={{ duration: 0.3 }}
          />
          <defs>
            <linearGradient id="analyzeGrad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={24} className="text-[var(--accent-primary)] animate-pulse" />
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-[var(--text-primary)] text-lg">{progress}% Complete</p>
        <motion.p
          key={stepIdx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[var(--text-muted)] mt-2"
        >
          {steps[Math.min(stepIdx, steps.length - 1)]}
        </motion.p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2.5">
            <div className={cn(
              'w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all',
              i < stepIdx ? 'bg-emerald-500' : i === stepIdx ? 'bg-[var(--accent-primary)] animate-pulse' : 'bg-[var(--border)]',
            )}>
              {i < stepIdx && <Check size={9} className="text-white" />}
            </div>
            <span className={cn('text-xs', i <= stepIdx ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]')}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MetadataOutput({ asset, metadata }: { asset: ImageAsset; metadata: GeneratedMetadata }) {
  const { regenerateField, settings } = useAppStore();
  const [regenLoading, setRegenLoading] = useState<Record<string, boolean>>({});

  const handleRegen = async (field: 'title' | 'description' | 'tags') => {
    setRegenLoading(p => ({ ...p, [field]: true }));
    await regenerateField(asset.id, field);
    setRegenLoading(p => ({ ...p, [field]: false }));
  };

  return (
    <motion.div
      key="output"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* SEO Score Panel */}
      <GlassCard className="p-5" animate={false}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-lg">Metadata Generated</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={metadata.isCommercial ? 'success' : 'default'} size="sm">
                {metadata.isCommercial ? '✓ Commercial' : '× Commercial'}
              </Badge>
              <Badge variant={metadata.isEditorial ? 'info' : 'default'} size="sm">
                {metadata.isEditorial ? '✓ Editorial' : '× Editorial'}
              </Badge>
              <Badge variant="default" size="sm">{metadata.category}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SEOScoreRing score={metadata.seoScore} size={80} label="Overall" />
            <div className="flex flex-col gap-2">
              <MiniScore label="Title" score={metadata.titleScore} />
              <MiniScore label="Desc" score={metadata.descriptionScore} />
              <MiniScore label="Tags" score={metadata.tagsScore} />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Title Controller */}
      <FieldController
        label="Title"
        icon={<Type size={15} />}
        value={metadata.title}
        maxChars={settings.titleMaxChars}
        loading={regenLoading.title}
        onRegenerate={() => handleRegen('title')}
        isLocked={false}
      />

      {/* Description Controller */}
      <FieldController
        label="Description"
        icon={<AlignLeft size={15} />}
        value={metadata.description}
        maxChars={settings.descriptionMaxChars}
        loading={regenLoading.description}
        onRegenerate={() => handleRegen('description')}
        isLocked={false}
        multiline
      />

      {/* Tags Controller */}
      <TagsController
        tags={metadata.tags}
        limit={settings.tagsLimit}
        loading={regenLoading.tags}
        onRegenerate={() => handleRegen('tags')}
        assetId={asset.id}
      />
    </motion.div>
  );
}

function MiniScore({ label, score }: { label: string; score: number }) {
  const color = score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--text-muted)] w-7">{label}</span>
      <div className="flex-1 w-20 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-6" style={{ color }}>{score}</span>
    </div>
  );
}

function FieldController({
  label, icon, value, maxChars, loading, onRegenerate, isLocked, multiline,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  maxChars: number;
  loading: boolean;
  onRegenerate: () => void;
  isLocked: boolean;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [copied, setCopied] = useState(false);
  const [locked, setLocked] = useState(isLocked);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charRatio = value.length / maxChars;
  const charColor = charRatio > 1 ? '#EF4444' : charRatio > 0.9 ? '#F59E0B' : '#10B981';

  return (
    <GlassCard className="p-5" animate={false}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent-primary)]">{icon}</span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
          {locked && (
            <Badge variant="warning" size="sm">
              <Lock size={9} /> Locked
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono" style={{ color: charColor }}>
            {value.length}/{maxChars}
          </span>
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            title="Copy"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          {/* Edit toggle */}
          <button
            onClick={() => { setEditing(!editing); setEditValue(value); }}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            title="Edit"
          >
            <Edit3 size={13} />
          </button>
          {/* Lock toggle */}
          <button
            onClick={() => setLocked(!locked)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            title={locked ? 'Unlock field' : 'Lock field'}
          >
            {locked ? <Lock size={13} /> : <Unlock size={13} />}
          </button>
          {/* Regenerate */}
          <button
            onClick={onRegenerate}
            disabled={loading || locked}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              locked
                ? 'opacity-40 cursor-not-allowed bg-[var(--border)] text-[var(--text-muted)]'
                : 'btn-gradient text-white shadow-md hover:shadow-lg',
            )}
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Regenerating...' : `Regen ${label}`}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {multiline ? (
              <textarea
                className="input-glass w-full p-3 rounded-xl text-sm resize-none"
                rows={4}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <input
                className="input-glass w-full px-3 py-2.5 rounded-xl text-sm"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            )}
            <div className="flex gap-2 mt-2">
              <Button size="xs" variant="gradient" icon={<Check size={11} />} onClick={() => setEditing(false)}>
                Save
              </Button>
              <Button size="xs" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.p key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-sm text-[var(--text-secondary)] leading-relaxed"
          >
            {value}
          </motion.p>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function TagsController({ tags, limit, loading, onRegenerate, assetId }: {
  tags: string[];
  limit: number;
  loading: boolean;
  onRegenerate: () => void;
  assetId: string;
}) {
  const { updateAsset, assets } = useAppStore();
  const asset = assets.find(a => a.id === assetId);
  const [copied, setCopied] = useState(false);

  const removeTag = (tag: string) => {
    if (!asset?.metadata) return;
    updateAsset(assetId, {
      metadata: { ...asset.metadata, tags: asset.metadata.tags.filter(t => t !== tag) }
    });
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(tags.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="p-5" animate={false}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag size={15} className="text-[var(--accent-primary)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Keywords / Tags</span>
          <Badge variant="info" size="sm">{tags.length}/{limit}</Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyAll}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            title="Copy all tags"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold btn-gradient text-white shadow-md"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Regenerating...' : 'Regen Tags'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <AnimatePresence>
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.02 }}
              className="tag-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
              >
                <X size={10} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-3 flex items-center gap-1.5">
        <Info size={11} />
        Click × to remove individual tags. Regenerating tags preserves title, description, and SEO scores.
      </p>
    </GlassCard>
  );
}

function SliderSetting({ label, value, options, onChange, icon }: {
  label: string;
  value: number;
  options: number[];
  onChange: (v: number) => void;
  icon: React.ReactNode;
}) {
  const min = options[0];
  const max = options[options.length - 1];

  const snapToNearest = (raw: number) => {
    return options.reduce((prev, curr) =>
      Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
          <span className="text-[var(--accent-primary)]">{icon}</span>
          {label}
        </label>
        <span className="text-xs font-bold text-[var(--accent-primary)] font-mono">{value} chars</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={1}
        onChange={(e) => onChange(snapToNearest(Number(e.target.value)))}
        className="w-full"
      />
      <div className="flex justify-between mt-1">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-md font-mono transition-all',
              value === o
                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function MarketplaceSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = MARKETPLACE_OPTIONS.find(m => m.value === value) || MARKETPLACE_OPTIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[var(--border-strong)] text-sm text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all"
      >
        <ShoppingBag size={14} style={{ color: selected.color }} />
        <span className="font-medium">{selected.label}</span>
        <ChevronDown size={12} className="text-[var(--text-muted)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bubble-glass rounded-xl overflow-hidden z-50 border border-[var(--border-strong)]"
          >
            {MARKETPLACE_OPTIONS.map(m => (
              <button
                key={m.value}
                onClick={() => { onChange(m.value); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all',
                  value === m.value
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
                )}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                {m.label}
                {value === m.value && <Check size={12} className="ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelSelector() {
  const { setActiveProvider, settings, updateSettings } = useAppStore();
  const [open, setOpen] = useState(false);

  const AI_MODELS = [
    { provider: 'openai' as const, model: 'gpt-4o', label: 'GPT-4o', speed: 'fast' },
    { provider: 'openai' as const, model: 'gpt-4-turbo', label: 'GPT-4 Turbo', speed: 'powerful' },
    { provider: 'openai' as const, model: 'gpt-5', label: 'GPT-5 ✦', speed: 'powerful' },
    { provider: 'gemini' as const, model: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', speed: 'powerful' },
    { provider: 'gemini' as const, model: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', speed: 'fast' },
    { provider: 'grok' as const, model: 'grok-4', label: 'Grok 4', speed: 'powerful' },
    { provider: 'grok' as const, model: 'grok-fast', label: 'Grok Fast', speed: 'fast' },
    { provider: 'claude' as const, model: 'claude-3-5-sonnet', label: 'Claude 3.5', speed: 'balanced' },
    { provider: 'deepseek' as const, model: 'deepseek-v3', label: 'DeepSeek V3', speed: 'balanced' },
  ];

  const selected = AI_MODELS.find(m => m.model === settings.model) || AI_MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[var(--border-strong)] text-sm text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all"
      >
        <Cpu size={14} className="text-[var(--accent-primary)]" />
        <span className="font-medium">{selected.label}</span>
        <ChevronDown size={12} className="text-[var(--text-muted)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bubble-glass rounded-xl overflow-hidden z-50 border border-[var(--border-strong)]"
          >
            {AI_MODELS.map(m => (
              <button
                key={m.model}
                onClick={() => { updateSettings({ provider: m.provider, model: m.model }); setActiveProvider(m.provider); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all',
                  settings.model === m.model
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
                )}
              >
                <span className="flex-1 text-left">{m.label}</span>
                <span className={cn(
                  'text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                  m.speed === 'fast' ? 'bg-emerald-500/15 text-emerald-400' :
                  m.speed === 'powerful' ? 'bg-violet-500/15 text-violet-400' :
                  'bg-amber-500/15 text-amber-400',
                )}>
                  {m.speed}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
