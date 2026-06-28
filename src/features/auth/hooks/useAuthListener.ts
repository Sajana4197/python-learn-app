import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabase/client';
import { useSessionStore } from '@/store/sessionStore';

/**
 * Mounted once, at the root layout. Restores any persisted session on
 * cold start and keeps `useSessionStore` in sync with every subsequent
 * auth event (sign-in, sign-out, token refresh) for the lifetime of the
 * app. Components never call `supabase.auth.onAuthStateChange`
 * themselves — they just read `useSessionStore`.
 */
export function useAuthListener() {
  const setSession = useSessionStore((s) => s.setSession);
  const setInitializing = useSessionStore((s) => s.setInitializing);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // No project configured: treat as a settled "signed out" state
      // immediately rather than hanging on isInitializing forever.
      setSession(null);
      setInitializing(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      })
      .catch(() => {
        // Treat an unreachable/failed session check as signed-out rather
        // than hanging the splash screen indefinitely.
        setSession(null);
      })
      .finally(() => setInitializing(false));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [setSession, setInitializing]);
}
