// ─── Enums ─────────────────────────────────────────────────────────────────

export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE' | 'ADMIN';
export type AIProviderType = 'openai' | 'gemini' | 'grok' | 'claude' | 'deepseek' | 'openrouter';
export type MarketplaceType = 'adobe_stock' | 'shutterstock' | 'freepik' | 'istock' | 'dreamstime' | 'alamy';
export type ExportFormat = 'txt' | 'csv' | 'xlsx' | 'json';

// ─── User ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tier: SubscriptionTier;
  credits: number;
  creditsUsed: number;
  createdAt: string;
}

// ─── AI Provider ───────────────────────────────────────────────────────────

export interface AIProvider {
  id: string;
  type: AIProviderType;
  label: string;
  model: string;
  apiKey: string;
  isActive: boolean;
  isConfigured: boolean;
}

export interface AIModel {
  id: string;
  label: string;
  provider: AIProviderType;
  contextWindow: string;
  speed: 'fast' | 'balanced' | 'powerful';
  costPer1k: number;
}

// ─── Image Asset ───────────────────────────────────────────────────────────

export interface ImageAsset {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  extension: string;
  width?: number;
  height?: number;
  status: 'queued' | 'analyzing' | 'complete' | 'error';
  progress: number;
  metadata?: GeneratedMetadata;
}

// ─── Metadata ──────────────────────────────────────────────────────────────

export interface GeneratedMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  subcategory: string;
  isCommercial: boolean;
  isEditorial: boolean;
  seoScore: number;
  titleScore: number;
  descriptionScore: number;
  tagsScore: number;
  marketplace: MarketplaceType;
  generatedAt: string;
}

// ─── Generation Settings ───────────────────────────────────────────────────

export interface GenerationSettings {
  titleMaxChars: number;
  descriptionMaxChars: number;
  tagsLimit: number;
  marketplace: MarketplaceType;
  provider: AIProviderType;
  model: string;
  customPrompt: string;
}

// ─── Prompt Template ──────────────────────────────────────────────────────

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  marketplace: MarketplaceType;
  createdAt: string;
}

// ─── Generation History ────────────────────────────────────────────────────

export interface GenerationHistoryItem {
  id: string;
  imageId: string;
  imageName: string;
  previewUrl: string;
  metadata: GeneratedMetadata;
  provider: AIProviderType;
  model: string;
  creditsUsed: number;
  createdAt: string;
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalImagesProcessed: number;
  totalKeywordsGenerated: number;
  activeContributors: number;
  averageSeoScore: number;
  productRating: number;
  creditsUsed: number;
  creditsRemaining: number;
  mostUsedMarketplace: MarketplaceType;
}

// ─── Batch Job ─────────────────────────────────────────────────────────────

export interface BatchJob {
  id: string;
  name: string;
  totalImages: number;
  processedImages: number;
  status: 'idle' | 'running' | 'paused' | 'complete' | 'error';
  progress: number;
  createdAt: string;
  images: ImageAsset[];
}

// ─── Navigation ────────────────────────────────────────────────────────────

export type NavSection =
  | 'dashboard'
  | 'generator'
  | 'bulk'
  | 'marketplace'
  | 'history'
  | 'templates'
  | 'settings'
  | 'billing'
  | 'admin';
