import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Download, FileText, Table,
  FileJson, Layers, CheckCircle2, AlertCircle, Clock,
  BarChart3, Zap, ChevronRight, Image,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { ExportFormat } from '../../types';
import { cn } from '../../utils/cn';

const EXPORT_FORMATS: { format: ExportFormat; label: string; desc: string; icon: React.ReactNode }[] = [
  { format: 'csv', label: 'CSV', desc: 'Standard spreadsheet format', icon: <Table size={16} /> },
  { format: 'xlsx', label: 'XLSX', desc: 'Microsoft Excel workbook', icon: <Table size={16} /> },
  { format: 'json', label: 'JSON', desc: 'Structured JSON array', icon: <FileJson size={16} /> },
  { format: 'txt', label: 'TXT', desc: 'Plain text per image', icon: <FileText size={16} /> },
];



export function BulkSuite() {
  const { batchJobs, activeBatch, createBatch, startBatch, pauseBatch } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const displayJob = selectedJobId
    ? batchJobs.find(j => j.id === selectedJobId) || activeBatch
    : activeBatch;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'].includes(f.type)
    );
    if (files.length > 0) createBatch(files);
  }, [createBatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) createBatch(files);
    e.target.value = '';
  };

  const handleExport = (format: ExportFormat) => {
    if (!displayJob) return;
    const completed = displayJob.images.filter(img => img.metadata);
    const rows = completed.map(img => ({
      filename: img.name,
      title: img.metadata?.title || '',
      description: img.metadata?.description || '',
      tags: img.metadata?.tags.join(', ') || '',
      category: img.metadata?.category || '',
      seo_score: img.metadata?.seoScore || 0,
      marketplace: img.metadata?.marketplace || '',
    }));

    let content = '';
    let mimeType = 'text/plain';
    let filename = `stockseo-export.${format}`;

    if (format === 'json') {
      content = JSON.stringify(rows, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      const headers = Object.keys(rows[0] || {}).join(',');
      const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
      content = `${headers}\n${body}`;
      mimeType = 'text/csv';
    } else if (format === 'txt') {
      content = rows.map(r =>
        `=== ${r.filename} ===\nTitle: ${r.title}\nDescription: ${r.description}\nTags: ${r.tags}\nCategory: ${r.category}\nSEO Score: ${r.seo_score}\n`
      ).join('\n');
    } else {
      content = JSON.stringify(rows, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Bulk Generator Suite</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Upload and process multiple images with parallel AI metadata generation</p>
        </div>
        {displayJob && displayJob.status === 'complete' && (
          <div className="flex items-center gap-2 flex-wrap">
            {EXPORT_FORMATS.map(fmt => (
              <Button
                key={fmt.format}
                variant={exportFormat === fmt.format ? 'gradient' : 'outline'}
                size="sm"
                icon={fmt.icon}
                onClick={() => { setExportFormat(fmt.format); handleExport(fmt.format); }}
              >
                Export {fmt.label}
              </Button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Upload + Jobs */}
        <div className="space-y-4">
          {/* Drop Zone */}
          <GlassCard className="p-0 overflow-hidden" delay={0.1}>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex flex-col items-center justify-center gap-3 p-8 cursor-pointer transition-all min-h-[180px]',
                'border-2 border-dashed rounded-2xl',
                dragActive ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5' : 'border-[var(--border-strong)]',
              )}
            >
              <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center shadow-lg">
                <Layers size={22} className="text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-[var(--text-primary)] text-sm">Upload Batch</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Up to 50 images per batch</p>
              </div>
            </div>
          </GlassCard>

          {/* Batch Jobs History */}
          <GlassCard className="p-4" delay={0.15}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Clock size={14} className="text-[var(--accent-primary)]" />
              Recent Batches
            </h3>
            {batchJobs.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-4">No batches yet</p>
            ) : (
              <div className="space-y-2">
                {batchJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                      selectedJobId === job.id || (!selectedJobId && activeBatch?.id === job.id)
                        ? 'bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30'
                        : 'hover:bg-[var(--bg-tertiary)] border border-transparent',
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                      job.status === 'complete' ? 'bg-emerald-500/15 text-emerald-400' :
                      job.status === 'running' ? 'bg-blue-500/15 text-blue-400' :
                      job.status === 'error' ? 'bg-red-500/15 text-red-400' :
                      'bg-[var(--bg-tertiary)] text-[var(--text-muted)]',
                    )}>
                      {job.status === 'complete' ? <CheckCircle2 size={14} /> :
                       job.status === 'running' ? <Zap size={14} /> :
                       job.status === 'error' ? <AlertCircle size={14} /> :
                       <Clock size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{job.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {job.processedImages}/{job.totalImages} images · {job.progress}%
                      </p>
                    </div>
                    <ChevronRight size={12} className="text-[var(--text-muted)] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right: Active Batch Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!displayJob ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bubble-glass rounded-2xl flex flex-col items-center justify-center min-h-[400px] gap-4"
              >
                <Image size={48} className="text-[var(--text-muted)]" strokeWidth={1} />
                <p className="text-sm text-[var(--text-secondary)] font-medium">No batch selected</p>
                <p className="text-xs text-[var(--text-muted)]">Upload images to start a batch job</p>
              </motion.div>
            ) : (
              <motion.div key={displayJob.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Batch Stats */}
                <GlassCard className="p-5" animate={false}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)]">{displayJob.name}</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {displayJob.processedImages} of {displayJob.totalImages} images processed
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        displayJob.status === 'complete' ? 'success' :
                        displayJob.status === 'running' ? 'info' :
                        displayJob.status === 'error' ? 'danger' : 'default'
                      }>
                        {displayJob.status.charAt(0).toUpperCase() + displayJob.status.slice(1)}
                      </Badge>
                      {displayJob.status === 'idle' && (
                        <Button size="sm" variant="gradient" icon={<Play size={13} />}
                          onClick={() => startBatch(displayJob.id)}>
                          Start
                        </Button>
                      )}
                      {displayJob.status === 'running' && (
                        <Button size="sm" variant="outline" icon={<Pause size={13} />}
                          onClick={() => pauseBatch(displayJob.id)}>
                          Pause
                        </Button>
                      )}
                      {displayJob.status === 'complete' && (
                        <Button size="sm" variant="gradient" icon={<Download size={13} />}
                          onClick={() => handleExport(exportFormat)}>
                          Export {exportFormat.toUpperCase()}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                      <span>Progress</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">{displayJob.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-[var(--border)] rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${displayJob.progress}%` }}
                        transition={{ duration: 0.4 }}
                        className={cn('h-full rounded-full', displayJob.status === 'running' ? 'progress-bar-animated' : '')}
                        style={displayJob.status !== 'running' ? { background: 'var(--accent-gradient)' } : {}}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {[
                      { label: 'Total', value: displayJob.totalImages, color: 'text-[var(--text-primary)]' },
                      { label: 'Done', value: displayJob.processedImages, color: 'text-emerald-400' },
                      { label: 'Pending', value: displayJob.totalImages - displayJob.processedImages, color: 'text-amber-400' },
                      { label: 'Errors', value: displayJob.images.filter(i => i.status === 'error').length, color: 'text-red-400' },
                    ].map(s => (
                      <div key={s.label} className="text-center p-2.5 rounded-xl bg-[var(--bg-tertiary)]">
                        <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Export Formats */}
                {displayJob.status === 'complete' && (
                  <GlassCard className="p-5" animate={false}>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                      <Download size={14} className="text-[var(--accent-primary)]" />
                      Export Metadata
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {EXPORT_FORMATS.map(fmt => (
                        <button
                          key={fmt.format}
                          onClick={() => handleExport(fmt.format)}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all group"
                        >
                          <div className="p-2 rounded-xl bg-[var(--bg-tertiary)] group-hover:bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] transition-all">
                            {fmt.icon}
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-[var(--text-primary)]">{fmt.label}</div>
                            <div className="text-[10px] text-[var(--text-muted)]">{fmt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Image Grid */}
                <GlassCard className="p-5" animate={false}>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <BarChart3 size={14} className="text-[var(--accent-primary)]" />
                    Image Queue
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                    {displayJob.images.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="relative rounded-xl overflow-hidden border border-[var(--border)] group"
                      >
                        <img src={img.previewUrl} alt={img.name} className="w-full h-24 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        {/* Status indicator */}
                        <div className="absolute top-2 right-2">
                          {img.status === 'complete' ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <CheckCircle2 size={11} className="text-white" />
                            </div>
                          ) : img.status === 'analyzing' ? (
                            <div className="w-5 h-5 rounded-full bg-blue-500 animate-pulse flex items-center justify-center">
                              <Zap size={10} className="text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[var(--border)] flex items-center justify-center">
                              <Clock size={10} className="text-[var(--text-muted)]" />
                            </div>
                          )}
                        </div>
                        {/* SEO score */}
                        {img.metadata && (
                          <div className="absolute bottom-1.5 right-2">
                            <span className="text-xs font-bold text-white">{img.metadata.seoScore}</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white text-[10px] truncate">{img.name}</p>
                        </div>
                        {/* Progress bar */}
                        {img.status === 'analyzing' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                            <div
                              className="h-full bg-blue-400 transition-all"
                              style={{ width: `${img.progress}%` }}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/tiff"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
