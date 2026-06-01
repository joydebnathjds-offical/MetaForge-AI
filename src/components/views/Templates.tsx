import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, ShoppingBag, Edit3, Trash2, Copy, Check, Star } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';


const MARKETPLACE_COLORS: Record<string, string> = {
  'Adobe Stock': '#FF0000',
  'Shutterstock': '#EE3423',
  'Freepik': '#1273EB',
  'iStock': '#009999',
  'All Platforms': '#7C3AED',
};

const DEFAULT_TEMPLATES = [
  {
    id: 't1', name: 'Nature & Wildlife', marketplace: 'Adobe Stock', usageCount: 48,
    description: 'Optimized for outdoor nature photography with geographic specificity and mood descriptors',
    prompt: 'Analyze this nature/wildlife photograph. Generate metadata with geographic context, species names if visible, time of day, weather conditions, and conservation relevance. Title should be location-specific and emotionally evocative. Tags should include scientific terms where applicable.',
    isPublic: true,
  },
  {
    id: 't2', name: 'Corporate Business', marketplace: 'Shutterstock', usageCount: 132,
    description: 'Business and professional imagery with workplace context and diversity emphasis',
    prompt: 'This is a business/corporate stock image. Focus metadata on professional context: workplace setting, collaboration, technology tools visible, diversity of subjects, and corporate communication themes. Avoid specific company branding.',
    isPublic: true,
  },
  {
    id: 't3', name: 'Food & Culinary', marketplace: 'Freepik', usageCount: 76,
    description: 'Food photography with ingredient focus, cuisine type, and preparation style',
    prompt: 'Generate culinary metadata for this food image. Identify ingredients, cuisine type (Mediterranean, Asian, etc.), preparation method, dietary categories (vegan, gluten-free), and presentation style. Tags should include ingredients, flavors, cooking methods, and occasions.',
    isPublic: false,
  },
  {
    id: 't4', name: 'Abstract & Digital Art', marketplace: 'All Platforms', usageCount: 29,
    description: 'Abstract compositions with color theory, style, and design application focus',
    prompt: 'Analyze this abstract/digital artwork. Describe dominant colors, geometric vs organic forms, texture quality, suggested use cases (backgrounds, wallpapers, design assets), and artistic style inspiration. Tags should emphasize colors, styles, moods, and design applications.',
    isPublic: true,
  },
  {
    id: 't5', name: 'Architecture & Urban', marketplace: 'iStock', usageCount: 41,
    description: 'Architectural photography with structural and design vocabulary',
    prompt: 'Generate metadata for this architectural/urban photograph. Identify architectural style (modern, brutalist, etc.), materials visible, urban vs suburban context, time period suggested, and usage contexts (real estate, travel, editorial). Include both broad and specific architectural terminology.',
    isPublic: false,
  },
];

export function Templates() {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [creating, setCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', marketplace: 'All Platforms', prompt: '', description: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (prompt: string, id: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleCreate = () => {
    if (!newTemplate.name || !newTemplate.prompt) return;
    setTemplates(prev => [{
      id: `t${Date.now()}`,
      ...newTemplate,
      usageCount: 0,
      isPublic: false,
    }, ...prev]);
    setNewTemplate({ name: '', marketplace: 'All Platforms', prompt: '', description: '' });
    setCreating(false);
  };

  return (
    <div className="p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Prompt Templates</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Create and manage reusable AI prompt templates for consistent metadata generation</p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => setCreating(true)}
        >
          New Template
        </Button>
      </motion.div>

      {/* Create Template Form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard className="p-5" animate={false}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Create New Template</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Template Name *</label>
                    <input
                      className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                      placeholder="e.g. Travel Photography"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Target Marketplace</label>
                    <select
                      className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                      value={newTemplate.marketplace}
                      onChange={(e) => setNewTemplate(p => ({ ...p, marketplace: e.target.value }))}
                    >
                      {['All Platforms', 'Adobe Stock', 'Shutterstock', 'Freepik', 'iStock', 'Dreamstime', 'Alamy'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Short Description</label>
                  <input
                    className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                    placeholder="Describe when to use this template..."
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Prompt Template *</label>
                  <textarea
                    className="input-glass w-full px-3 py-2.5 rounded-xl text-sm resize-none"
                    rows={5}
                    placeholder="Write your AI prompt template here. Be specific about the context, what to focus on, and any special requirements..."
                    value={newTemplate.prompt}
                    onChange={(e) => setNewTemplate(p => ({ ...p, prompt: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="gradient" size="sm" icon={<Plus size={13} />} onClick={handleCreate}>
                    Create Template
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {templates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bubble-glass rounded-2xl p-5 group"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${MARKETPLACE_COLORS[template.marketplace] || '#7C3AED'}20`, color: MARKETPLACE_COLORS[template.marketplace] || '#7C3AED' }}
                >
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">{template.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="default" size="sm">
                      <ShoppingBag size={9} style={{ color: MARKETPLACE_COLORS[template.marketplace] }} />
                      {template.marketplace}
                    </Badge>
                    {template.isPublic && (
                      <Badge variant="success" size="sm">Public</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(template.prompt, template.id)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                  title="Copy prompt"
                >
                  {copiedId === template.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] mb-3">{template.description}</p>

            <div className="bg-[var(--bg-secondary)] rounded-xl p-3 border border-[var(--border)]">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3 font-mono">
                {template.prompt}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                <Star size={10} className="text-amber-400" fill="currentColor" />
                Used {template.usageCount} times
              </span>
              <Button size="xs" variant="gradient">Use Template</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
