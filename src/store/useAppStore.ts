import { create } from 'zustand';
import type {
  User, AIProvider, AIProviderType, ImageAsset, GenerationSettings,
  GeneratedMetadata, MarketplaceType, NavSection, BatchJob, GenerationHistoryItem,
  DashboardStats,
} from '../types';

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_USER: User = {
  id: 'usr_01',
  email: 'alex@stockseo.ai',
  name: 'Alex Rivera',
  avatar: '',
  tier: 'PRO',
  credits: 500,
  creditsUsed: 247,
  createdAt: '2024-01-15',
};

const MOCK_PROVIDERS: AIProvider[] = [
  { id: 'p1', type: 'openai', label: 'OpenAI', model: 'gpt-4o', apiKey: '', isActive: true, isConfigured: false },
  { id: 'p2', type: 'gemini', label: 'Google Gemini', model: 'gemini-2.5-pro', apiKey: '', isActive: false, isConfigured: false },
  { id: 'p3', type: 'grok', label: 'Grok (xAI)', model: 'grok-4', apiKey: '', isActive: false, isConfigured: false },
  { id: 'p4', type: 'claude', label: 'Anthropic Claude', model: 'claude-3-5-sonnet', apiKey: '', isActive: false, isConfigured: false },
  { id: 'p5', type: 'deepseek', label: 'DeepSeek', model: 'deepseek-v3', apiKey: '', isActive: false, isConfigured: false },
  { id: 'p6', type: 'openrouter', label: 'OpenRouter', model: 'auto', apiKey: '', isActive: false, isConfigured: false },
];

const MOCK_STATS: DashboardStats = {
  totalImagesProcessed: 2400000,
  totalKeywordsGenerated: 120000000,
  activeContributors: 12000,
  averageSeoScore: 88.4,
  productRating: 4.9,
  creditsUsed: 247,
  creditsRemaining: 253,
  mostUsedMarketplace: 'adobe_stock',
};

// ─── Store Interface ───────────────────────────────────────────────────────

interface AppStore {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Navigation
  activeSection: NavSection;
  sidebarOpen: boolean;
  setActiveSection: (s: NavSection) => void;
  setSidebarOpen: (v: boolean) => void;

  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // AI Providers
  providers: AIProvider[];
  activeProvider: AIProvider;
  setActiveProvider: (type: AIProviderType) => void;
  updateProviderKey: (id: string, key: string) => void;
  toggleProvider: (id: string) => void;

  // Generation Settings
  settings: GenerationSettings;
  updateSettings: (patch: Partial<GenerationSettings>) => void;

  // Image Assets (Single Generator)
  assets: ImageAsset[];
  addAssets: (files: File[]) => void;
  removeAsset: (id: string) => void;
  clearAssets: () => void;
  updateAsset: (id: string, patch: Partial<ImageAsset>) => void;

  // Generation
  isGenerating: boolean;
  generateMetadata: (assetId: string) => Promise<void>;
  regenerateField: (assetId: string, field: 'title' | 'description' | 'tags') => Promise<void>;

  // Batch
  batchJobs: BatchJob[];
  activeBatch: BatchJob | null;
  createBatch: (files: File[]) => void;
  startBatch: (id: string) => void;
  pauseBatch: (id: string) => void;

  // History
  history: GenerationHistoryItem[];

  // Stats
  stats: DashboardStats;

  // Marketplace
  selectedMarketplace: MarketplaceType;
  setMarketplace: (m: MarketplaceType) => void;
}

// ─── Mock Generation ───────────────────────────────────────────────────────

let idCounter = 0;
const uid = () => `id_${Date.now()}_${idCounter++}`;

const MOCK_TITLES = [
  'Vibrant Sunset Over Mountain Lake With Golden Reflections',
  'Professional Business Team Collaborating In Modern Office Space',
  'Abstract Geometric Pattern With Bold Colorful Shapes',
  'Fresh Organic Vegetables Arranged On Rustic Wooden Table',
  'Dynamic Urban Cityscape At Night With Neon Lights',
];

const MOCK_DESCRIPTIONS = [
  'Stunning aerial photograph capturing a breathtaking mountain lake at sunset with golden hour lighting reflecting off calm waters. Perfect for travel, nature, and landscape projects requiring premium stock imagery.',
  'High-quality photograph of diverse business professionals working together in a contemporary office environment. Ideal for corporate communications, HR materials, and business presentations.',
  'Eye-catching abstract composition featuring bold geometric shapes in vibrant complementary colors. Suitable for modern design projects, backgrounds, and creative marketing campaigns.',
];

const MOCK_TAGS = [
  ['nature', 'landscape', 'sunset', 'mountain', 'lake', 'reflection', 'golden', 'sky', 'water', 'serene', 'peaceful', 'outdoor', 'scenic', 'travel', 'adventure', 'wilderness', 'panoramic', 'horizon', 'clouds', 'beauty'],
  ['business', 'team', 'office', 'professional', 'collaboration', 'meeting', 'corporate', 'diversity', 'technology', 'modern', 'workspace', 'people', 'success', 'leadership', 'strategy', 'work', 'career', 'employee', 'management', 'executive'],
  ['abstract', 'geometric', 'pattern', 'colorful', 'design', 'art', 'background', 'creative', 'modern', 'vibrant', 'shape', 'digital', 'texture', 'graphic', 'visual', 'contemporary', 'minimal', 'bold', 'decorative', 'illustration'],
];

const MOCK_CATEGORIES = ['Nature & Landscape', 'Business & Finance', 'Technology', 'People & Lifestyle', 'Abstract & Backgrounds', 'Food & Beverage', 'Architecture & Buildings'];
const MOCK_SUBCATEGORIES = ['Aerial Photography', 'Golden Hour', 'Corporate Life', 'Remote Work', 'Digital Art', 'Minimalism'];

function mockGenerate(): GeneratedMetadata {
  const idx = Math.floor(Math.random() * MOCK_TITLES.length);
  const tagIdx = Math.floor(Math.random() * MOCK_TAGS.length);
  return {
    title: MOCK_TITLES[idx % MOCK_TITLES.length],
    description: MOCK_DESCRIPTIONS[idx % MOCK_DESCRIPTIONS.length],
    tags: MOCK_TAGS[tagIdx],
    category: MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)],
    subcategory: MOCK_SUBCATEGORIES[Math.floor(Math.random() * MOCK_SUBCATEGORIES.length)],
    isCommercial: Math.random() > 0.3,
    isEditorial: Math.random() > 0.6,
    seoScore: Math.floor(Math.random() * 20) + 78,
    titleScore: Math.floor(Math.random() * 15) + 82,
    descriptionScore: Math.floor(Math.random() * 18) + 79,
    tagsScore: Math.floor(Math.random() * 12) + 85,
    marketplace: 'adobe_stock',
    generatedAt: new Date().toISOString(),
  };
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Store ─────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>((set, get) => ({
  // Theme
  isDark: false,
  toggleTheme: () => {
    const next = !get().isDark;
    set({ isDark: next });
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  },

  // Navigation
  activeSection: 'dashboard',
  sidebarOpen: true,
  setActiveSection: (s) => set({ activeSection: s }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  // Auth
  user: MOCK_USER,
  isAuthenticated: true,
  login: () => set({ user: MOCK_USER, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Providers
  providers: MOCK_PROVIDERS,
  activeProvider: MOCK_PROVIDERS[0],
  setActiveProvider: (type) => {
    const p = get().providers.find(x => x.type === type);
    if (p) set({ activeProvider: p });
  },
  updateProviderKey: (id, key) => {
    set(s => ({
      providers: s.providers.map(p =>
        p.id === id ? { ...p, apiKey: key, isConfigured: key.length > 10 } : p
      ),
    }));
  },
  toggleProvider: (id) => {
    set(s => ({
      providers: s.providers.map(p =>
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ),
    }));
  },

  // Settings
  settings: {
    titleMaxChars: 100,
    descriptionMaxChars: 200,
    tagsLimit: 40,
    marketplace: 'adobe_stock',
    provider: 'openai',
    model: 'gpt-4o',
    customPrompt: '',
  },
  updateSettings: (patch) => set(s => ({ settings: { ...s.settings, ...patch } })),

  // Assets
  assets: [],
  addAssets: (files) => {
    const newAssets: ImageAsset[] = files.map(file => ({
      id: uid(),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      extension: file.name.split('.').pop()?.toUpperCase() || 'JPG',
      status: 'queued',
      progress: 0,
    }));
    // Extract dimensions
    newAssets.forEach(asset => {
      const img = new Image();
      img.onload = () => {
        get().updateAsset(asset.id, { width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = asset.previewUrl;
    });
    set(s => ({ assets: [...s.assets, ...newAssets] }));
  },
  removeAsset: (id) => set(s => ({ assets: s.assets.filter(a => a.id !== id) })),
  clearAssets: () => set({ assets: [] }),
  updateAsset: (id, patch) => set(s => ({
    assets: s.assets.map(a => a.id === id ? { ...a, ...patch } : a),
  })),

  // Generation
  isGenerating: false,
  generateMetadata: async (assetId) => {
    set({ isGenerating: true });
    get().updateAsset(assetId, { status: 'analyzing', progress: 0 });
    for (let p = 10; p <= 90; p += 15) {
      await sleep(180);
      get().updateAsset(assetId, { progress: p });
    }
    await sleep(400);
    const metadata = mockGenerate();
    get().updateAsset(assetId, { status: 'complete', progress: 100, metadata });
    set(s => ({
      isGenerating: false,
      stats: { ...s.stats, totalImagesProcessed: s.stats.totalImagesProcessed + 1, creditsUsed: s.stats.creditsUsed + 1 },
    }));
  },

  regenerateField: async (assetId, field) => {
    const asset = get().assets.find(a => a.id === assetId);
    if (!asset?.metadata) return;
    await sleep(800);
    const fresh = mockGenerate();
    const patch: Partial<GeneratedMetadata> = {};
    if (field === 'title') patch.title = fresh.title;
    if (field === 'description') patch.description = fresh.description;
    if (field === 'tags') patch.tags = fresh.tags;
    get().updateAsset(assetId, { metadata: { ...asset.metadata, ...patch } });
  },

  // Batch
  batchJobs: [],
  activeBatch: null,
  createBatch: (files) => {
    const assets: ImageAsset[] = files.map(f => ({
      id: uid(), file: f, previewUrl: URL.createObjectURL(f),
      name: f.name, size: f.size, extension: f.name.split('.').pop()?.toUpperCase() || 'JPG',
      status: 'queued', progress: 0,
    }));
    const job: BatchJob = {
      id: uid(), name: `Batch ${new Date().toLocaleDateString()}`,
      totalImages: files.length, processedImages: 0,
      status: 'idle', progress: 0,
      createdAt: new Date().toISOString(), images: assets,
    };
    set(s => ({ batchJobs: [job, ...s.batchJobs], activeBatch: job }));
  },
  startBatch: async (id) => {
    const job = get().batchJobs.find(j => j.id === id);
    if (!job) return;
    set(s => ({
      batchJobs: s.batchJobs.map(j => j.id === id ? { ...j, status: 'running' } : j),
      activeBatch: { ...job, status: 'running' },
    }));
    for (let i = 0; i < job.images.length; i++) {
      await sleep(1200);
      const processed = i + 1;
      const progress = Math.round((processed / job.images.length) * 100);
      const updatedImages = job.images.map((img, idx) =>
        idx <= i ? { ...img, status: 'complete' as const, progress: 100, metadata: mockGenerate() } : img
      );
      set(s => ({
        batchJobs: s.batchJobs.map(j => j.id === id ? { ...j, processedImages: processed, progress, images: updatedImages } : j),
        activeBatch: { ...job, processedImages: processed, progress, images: updatedImages, status: 'running' },
      }));
    }
    set(s => ({
      batchJobs: s.batchJobs.map(j => j.id === id ? { ...j, status: 'complete', progress: 100 } : j),
      activeBatch: s.batchJobs.find(j => j.id === id) ? { ...(s.batchJobs.find(j => j.id === id)!), status: 'complete', progress: 100 } : null,
    }));
  },
  pauseBatch: (id) => {
    set(s => ({
      batchJobs: s.batchJobs.map(j => j.id === id ? { ...j, status: 'paused' } : j),
    }));
  },

  // History
  history: [],

  // Stats
  stats: MOCK_STATS,

  // Marketplace
  selectedMarketplace: 'adobe_stock',
  setMarketplace: (m) => set({ selectedMarketplace: m, settings: { ...get().settings, marketplace: m } }),
}));
