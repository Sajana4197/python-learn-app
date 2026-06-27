import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

interface SessionState {
  session: Session | null;
  user: User | null;
  isInitializing: boolean;
  setSession: (session: Session | null) => void;
  setInitializing: (value: boolean) => void;
}

/**
 * Holds the live Supabase auth session. Populated by the auth listener set
 * up in Phase 2 (`src/features/auth/services`). Screens should read `user`
 * for display data and treat `session === null` as "signed out" — but see
 * `isInitializing`: on cold start this is true until the stored session has
 * been checked, so UIs should show a loading state rather than assuming
 * "signed out" during that window.
 */
export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  user: null,
  isInitializing: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setInitializing: (value) => set({ isInitializing: value }),
}));
