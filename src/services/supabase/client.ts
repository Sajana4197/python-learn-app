import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * The app must run fully offline-first even when Supabase isn't configured
 * (e.g. local dev without a project yet, or a build with cloud sync
 * disabled). We warn instead of throwing so Phases 1-6 — which don't need
 * auth — are never blocked by missing credentials.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Cloud sync features will be unavailable until configured in .env'
  );
}

/**
 * On native, `@react-native-async-storage/async-storage` is backed by
 * real native modules and is safe to use as-is. On web, its
 * implementation reads `window.localStorage` directly — which crashes
 * with "window is not defined" during Expo Router's static export, since
 * that prerender step runs the app once in Node (no `window`) to
 * generate each route's initial HTML. This is a well-known gap in the
 * Supabase + Expo Router web combination, not specific to our setup.
 *
 * The fix: detect whether we're actually in a browser before touching
 * AsyncStorage at all, and use an in-memory no-op store otherwise. The
 * server-rendered HTML for an auth-gated screen doesn't need a real
 * session anyway — the client takes over immediately after hydration and
 * reads the real session at that point.
 */
const isBrowser = typeof window !== 'undefined';

const memoryStore = new Map<string, string>();

const ssrSafeStorage = {
  getItem: async (key: string) => {
    if (!isBrowser) return memoryStore.get(key) ?? null;
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (!isBrowser) {
      memoryStore.set(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (!isBrowser) {
      memoryStore.delete(key);
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

/**
 * Supabase's `RealtimeClient` constructor (called eagerly inside
 * `createClient`, whether or not realtime features are ever used) needs
 * a WebSocket implementation. React Native and every modern browser
 * provide `globalThis.WebSocket` natively — covering every platform this
 * app actually ships to — so we use that whenever it exists.
 *
 * The one environment without it is the Node.js process running Metro's
 * dev server / Expo Router's SSR export, on Node < 22 (no native
 * `WebSocket` global there until v22). Supabase's own currently
 * sanctioned fix for that case is to install `ws` and pass it via
 * `realtime.transport` — see the Supabase maintainer's post at
 * github.com/orgs/supabase/discussions/37869. Without this, the
 * `RealtimeClient` constructor throws synchronously on Node < 22, which
 * surfaces as a hard Metro bundling error, not just a console warning.
 *
 * `ws` depends on Node-only core modules (`net`, `tls`, `stream`,
 * `http`) with no React Native equivalent, and Metro resolves
 * `require()` specifiers statically regardless of which runtime branch
 * actually executes — so requiring `ws` here would normally break the
 * iOS/Android bundle even though this branch never runs there. We avoid
 * that with `metro.config.js`'s `resolver.resolveRequest`, which redirects
 * `ws` to an empty stub for every platform Metro actually bundles the
 * app for. That stub is never invoked in practice (the branch below is
 * dead code on every one of those platforms), so the redirect is a
 * resolution-time-only safety net, not a real runtime change.
 */
const nativeWebSocket =
  typeof globalThis.WebSocket !== 'undefined' ? globalThis.WebSocket : undefined;

// eslint-disable-next-line @typescript-eslint/no-require-imports -- only reached on Node < 22; stubbed to an empty module on every bundled platform via metro.config.js.
const realtimeTransport = nativeWebSocket ?? require('ws');

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
  {
    auth: {
      storage: ssrSafeStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: { transport: realtimeTransport },
  }
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
