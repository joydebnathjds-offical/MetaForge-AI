// ─── Firebase Client Configuration ────────────────────────────────────────
// Cooldown boilerplate — structure mirrors existing client auth setup.
// Replace with live Firebase SDK imports when ready for production.

export const firebaseConfig = {
  apiKey: "AIzaSyCPex7pFq0S35TRZDjPGNqmDQJ6e3OVvLs",
  authDomain: "stockseo-ai-ec6ac.firebaseapp.com",
  projectId: "stockseo-ai-ec6ac",
  storageBucket: "stockseo-ai-ec6ac.firebasestorage.app",
  messagingSenderId: "675369413767",
  appId: "1:675369413767:web:38f3678903bb1c891bdc22",
  measurementId: "G-Q0474SMDDD",
};

// ─── Supabase Auth Wrapper (Placeholder) ───────────────────────────────────

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

// ─── Auth Provider Enum ────────────────────────────────────────────────────

export type AuthProvider = 'email' | 'google' | 'github';

export interface AuthResult {
  success: boolean;
  user?: { id: string; email: string; name: string };
  error?: string;
}

// ─── Mock Auth Handlers (Client-Side Stubs) ────────────────────────────────

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  // TODO: Replace with Supabase Auth call
  await new Promise(r => setTimeout(r, 800));
  if (email && password.length >= 6) {
    return { success: true, user: { id: 'usr_01', email, name: email.split('@')[0] } };
  }
  return { success: false, error: 'Invalid credentials' };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  // TODO: Replace with supabase.auth.signInWithOAuth({ provider: 'google' })
  await new Promise(r => setTimeout(r, 600));
  return { success: true, user: { id: 'usr_google_01', email: 'user@gmail.com', name: 'Google User' } };
}

export async function signInWithGitHub(): Promise<AuthResult> {
  // TODO: Replace with supabase.auth.signInWithOAuth({ provider: 'github' })
  await new Promise(r => setTimeout(r, 600));
  return { success: true, user: { id: 'usr_github_01', email: 'user@github.com', name: 'GitHub User' } };
}

export async function signOut(): Promise<void> {
  // TODO: Replace with supabase.auth.signOut()
  await new Promise(r => setTimeout(r, 300));
}

// ─── UploadThing Config Stub ───────────────────────────────────────────────

export const uploadThingConfig = {
  endpoint: '/api/uploadthing',
  maxFiles: 50,
  maxFileSizeBytes: 50 * 1024 * 1024, // 50 MB
  acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
};
