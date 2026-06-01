import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Check,
  Shield, Key, Zap, ExternalLink, Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { AIProvider } from '../../types';
import { cn } from '../../utils/cn';

const PROVIDER_CONFIG = {
  openai: {
    label: 'OpenAI',
    color: '#10A37F',
    models: ['gpt-5', 'gpt-4o', 'gpt-4-turbo', 'gpt-4'],
    docsUrl: 'https://platform.openai.com/api-keys',
    keyPrefix: 'sk-',
    desc: 'Industry-leading multimodal vision models',
  },
  gemini: {
    label: 'Google Gemini',
    color: '#4285F4',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-1.5-pro'],
    docsUrl: 'https://aistudio.google.com/app/apikey',
    keyPrefix: 'AIza',
    desc: 'Google\'s latest multimodal AI platform',
  },
  grok: {
    label: 'Grok (xAI)',
    color: '#1DA1F2',
    models: ['grok-4', 'grok-fast', 'grok-2'],
    docsUrl: 'https://console.x.ai',
    keyPrefix: 'xai-',
    desc: 'Elon Musk\'s real-time aware AI system',
  },
  claude: {
    label: 'Anthropic Claude',
    color: '#D4A574',
    models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
    docsUrl: 'https://console.anthropic.com/settings/keys',
    keyPrefix: 'sk-ant-',
    desc: 'Constitutional AI with advanced reasoning',
  },
  deepseek: {
    label: 'DeepSeek',
    color: '#5B6EE1',
    models: ['deepseek-v3', 'deepseek-v2', 'deepseek-coder'],
    docsUrl: 'https://platform.deepseek.com/api_keys',
    keyPrefix: 'sk-',
    desc: 'Open-source frontier model with low cost',
  },
  openrouter: {
    label: 'OpenRouter',
    color: '#FF6B4A',
    models: ['auto', 'google/gemini-pro', 'meta-llama/llama-3.3', 'anthropic/claude-3.5'],
    docsUrl: 'https://openrouter.ai/keys',
    keyPrefix: 'sk-or-',
    desc: 'Unified API for 200+ AI models',
  },
};

export function Settings() {
  const { providers, updateProviderKey, toggleProvider } = useAppStore();

  return (
    <div className="p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Settings & Integrations</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Configure your AI provider API keys and generation preferences</p>
        </div>
        <Badge variant="info" size="md">
          <Shield size={11} />
          AES-256 Encrypted Storage
        </Badge>
      </motion.div>

      {/* Security notice */}
      <GlassCard className="p-4" delay={0.05}>
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Enterprise-Grade Key Security</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              API keys are encrypted client-side using AES-256 before storage. Keys are never transmitted in plaintext 
              and are only used for direct provider API calls. Zero-knowledge architecture ensures no server-side key exposure.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Provider Cards */}
      <div className="space-y-4">
        {providers.map((provider, i) => (
          <ProviderCard key={provider.id} provider={provider} index={i} onUpdateKey={updateProviderKey} onToggle={toggleProvider} />
        ))}
      </div>

      {/* Firebase / Supabase Config */}
      <GlassCard className="p-5" delay={0.4}>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Key size={15} className="text-[var(--accent-primary)]" />
          Backend Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Firebase Project ID', value: 'stockseo-ai-ec6ac', readonly: true },
            { label: 'Firebase App ID', value: '1:675369413767:web:38f3678903bb1c891bdc22', readonly: true },
            { label: 'Supabase Project URL', value: 'https://your-project.supabase.co', readonly: false },
            { label: 'UploadThing Token', value: '', readonly: false, placeholder: 'ut_xxxxx...' },
          ].map(field => (
            <div key={field.label}>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">{field.label}</label>
              <input
                className="input-glass w-full px-3 py-2 rounded-xl text-sm font-mono"
                defaultValue={field.value}
                readOnly={field.readonly}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Prisma Schema Preview */}
      <GlassCard className="p-5" delay={0.45}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Info size={14} className="text-[var(--accent-primary)]" />
            Prisma Schema Reference
          </h3>
          <Badge variant="default" size="sm">PostgreSQL · Supabase</Badge>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 overflow-x-auto">
          <pre className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed whitespace-pre-wrap">
{`// schema.prisma — StockSEO AI
model User {
  id           String           @id @default(cuid())
  supabaseId   String           @unique
  email        String           @unique
  tier         SubscriptionTier @default(FREE)
  credits      Int              @default(50)
  creditsUsed  Int              @default(0)
  providers    AIProvider[]
  history      GenerationHistory[]
}

model AIProvider {
  id              String         @id
  type            AIProviderType
  encryptedApiKey String?        // AES-256
  model           String
  isActive        Boolean
}

model GenerationHistory {
  id          String   @id
  title       String
  description String
  tags        String[]
  seoScore    Float
  marketplace MarketplaceType
}`}
          </pre>
        </div>
      </GlassCard>
    </div>
  );
}

function ProviderCard({ provider, index, onUpdateKey, onToggle }: {
  provider: AIProvider;
  index: number;
  onUpdateKey: (id: string, key: string) => void;
  onToggle: (id: string) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const [keyValue, setKeyValue] = useState(provider.apiKey);
  const [saved, setSaved] = useState(false);
  const [selectedModel, setSelectedModel] = useState(provider.model);
  const config = PROVIDER_CONFIG[provider.type] || PROVIDER_CONFIG.openai;

  const handleSave = () => {
    onUpdateKey(provider.id, keyValue);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <GlassCard className="p-5" animate={false}>
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: config.color }}
          >
            {config.label.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[var(--text-primary)]">{config.label}</span>
              {provider.isConfigured && (
                <Badge variant="success" size="sm">
                  <Check size={9} /> Configured
                </Badge>
              )}
              {provider.isActive && (
                <Badge variant="info" size="sm">
                  <Zap size={9} /> Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{config.desc}</p>

            <div className="mt-4 space-y-3">
              {/* Model Selector */}
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Model</label>
                <select
                  className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {config.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* API Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">API Key</label>
                  <a
                    href={config.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[var(--accent-primary)] flex items-center gap-1 hover:underline"
                  >
                    Get API Key <ExternalLink size={9} />
                  </a>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      placeholder={`${config.keyPrefix}...`}
                      value={keyValue}
                      onChange={(e) => setKeyValue(e.target.value)}
                      className="input-glass w-full pl-3 pr-10 py-2 rounded-xl text-sm font-mono"
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <Button
                    size="sm"
                    variant={saved ? 'glass' : 'gradient'}
                    onClick={handleSave}
                    icon={saved ? <Check size={13} className="text-emerald-400" /> : <Shield size={13} />}
                  >
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => onToggle(provider.id)}
            className={cn(
              'relative w-12 h-6 rounded-full transition-all shrink-0 mt-1',
              provider.isActive ? 'bg-emerald-500' : 'bg-[var(--border-strong)]',
            )}
          >
            <motion.div
              animate={{ x: provider.isActive ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
