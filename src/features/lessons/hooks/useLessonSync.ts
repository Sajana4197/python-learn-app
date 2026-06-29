import { useEffect, useState } from 'react';
import { syncLessonsFromSupabase } from '../services/lessonsService';

export type SyncStatus = 'syncing' | 'success' | 'error' | 'unavailable';

/**
 * Fires a one-time lesson sync on mount. Deliberately fails soft: if
 * Supabase is unreachable or unconfigured, whatever's already cached in
 * SQLite from a previous successful sync remains fully usable — this
 * hook's status is informational (e.g. a small "offline" indicator),
 * never a blocker for rendering the roadmap.
 */
export function useLessonSync() {
  // Starts at 'syncing' directly (not 'idle') since this hook always
  // begins syncing immediately on mount — there's no real idle period to
  // model, and setting this synchronously inside the effect instead would
  // trigger an avoidable extra render.
  const [status, setStatus] = useState<SyncStatus>('syncing');

  useEffect(() => {
    let isMounted = true;

    syncLessonsFromSupabase().then((result) => {
      if (!isMounted) return;
      if (result.success) {
        setStatus('success');
      } else if (result.error === 'Supabase isn\u2019t configured.') {
        setStatus('unavailable');
      } else {
        setStatus('error');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return status;
}
