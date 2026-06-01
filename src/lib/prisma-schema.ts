// ─── Prisma Schema Reference ───────────────────────────────────────────────
// This file documents the full Prisma schema. Place schema.prisma in /prisma/
// for production. This TypeScript mirror provides type safety in the frontend.

export const PRISMA_SCHEMA = `
// prisma/schema.prisma
// StockSEO AI — Enterprise Database Schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─── Enums ─────────────────────────────────────────────────────────────────

enum SubscriptionTier {
  FREE
  PRO
  ENTERPRISE
  ADMIN
}

enum AIProviderType {
  OPENAI
  GEMINI
  GROK
  CLAUDE
  DEEPSEEK
  OPENROUTER
}

enum MarketplaceType {
  ADOBE_STOCK
  SHUTTERSTOCK
  FREEPIK
  ISTOCK
  DREAMSTIME
  ALAMY
}

enum AssetStatus {
  QUEUED
  ANALYZING
  COMPLETE
  ERROR
}

// ─── User & Profile ────────────────────────────────────────────────────────

model User {
  id            String           @id @default(cuid())
  supabaseId    String           @unique
  email         String           @unique
  name          String?
  avatarUrl     String?
  tier          SubscriptionTier @default(FREE)
  credits       Int              @default(50)
  creditsUsed   Int              @default(0)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  profile         Profile?
  aiProviders     AIProvider[]
  generationHistory GenerationHistory[]
  promptTemplates PromptTemplate[]
  batchJobs       BatchJob[]

  @@map("users")
}

model Profile {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio           String?
  website       String?
  portfolioUrl  String?
  primaryMarket MarketplaceType?
  contributorIds Json?   // {"adobe": "XXXXX", "shutterstock": "XXXXX", ...}
  preferences   Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("profiles")
}

// ─── AI Provider Configuration ─────────────────────────────────────────────

model AIProvider {
  id              String         @id @default(cuid())
  userId          String
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  type            AIProviderType
  label           String
  model           String
  encryptedApiKey String?        // AES-256 encrypted client token
  isActive        Boolean        @default(false)
  isConfigured    Boolean        @default(false)
  requestCount    Int            @default(0)
  lastUsedAt      DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  generationHistory GenerationHistory[]

  @@unique([userId, type])
  @@map("ai_providers")
}

// ─── Image Asset ───────────────────────────────────────────────────────────

model ImageAsset {
  id            String      @id @default(cuid())
  userId        String
  batchJobId    String?
  batchJob      BatchJob?   @relation(fields: [batchJobId], references: [id])
  uploadthingKey String?
  uploadthingUrl String?
  originalName  String
  mimeType      String
  sizeBytes     Int
  width         Int?
  height        Int?
  status        AssetStatus @default(QUEUED)
  createdAt     DateTime    @default(now())

  generationHistory GenerationHistory[]

  @@map("image_assets")
}

// ─── Generation History ────────────────────────────────────────────────────

model GenerationHistory {
  id            String         @id @default(cuid())
  userId        String
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  imageAssetId  String
  imageAsset    ImageAsset     @relation(fields: [imageAssetId], references: [id])
  providerId    String?
  provider      AIProvider?    @relation(fields: [providerId], references: [id])
  
  // Generated Metadata
  title         String
  description   String         @db.Text
  tags          String[]
  category      String?
  subcategory   String?
  isCommercial  Boolean        @default(true)
  isEditorial   Boolean        @default(false)
  marketplace   MarketplaceType @default(ADOBE_STOCK)
  
  // SEO Quality Scores (0-100)
  seoScore      Float          @default(0)
  titleScore    Float          @default(0)
  descriptionScore Float       @default(0)
  tagsScore     Float          @default(0)
  
  // Tracking
  creditsUsed   Int            @default(1)
  promptUsed    String?        @db.Text
  modelUsed     String?
  createdAt     DateTime       @default(now())

  @@map("generation_history")
}

// ─── Prompt Templates ──────────────────────────────────────────────────────

model PromptTemplate {
  id          String          @id @default(cuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  description String?
  prompt      String          @db.Text
  marketplace MarketplaceType?
  isPublic    Boolean         @default(false)
  usageCount  Int             @default(0)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@map("prompt_templates")
}

// ─── Batch Jobs ────────────────────────────────────────────────────────────

model BatchJob {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  totalImages     Int
  processedImages Int       @default(0)
  status          String    @default("idle") // idle|running|paused|complete|error
  progress        Float     @default(0)
  exportFormat    String?
  createdAt       DateTime  @default(now())
  completedAt     DateTime?

  images ImageAsset[]

  @@map("batch_jobs")
}
`;

export default PRISMA_SCHEMA;
