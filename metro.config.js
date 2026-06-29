const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

/**
 * expo-sqlite's web target runs on wa-sqlite, a WASM build of SQLite,
 * which needs its .wasm file resolved as a bundled asset. Metro doesn't
 * treat .wasm as an asset extension by default, so without this, the
 * web build fails with "Unable to resolve module ./wa-sqlite/wa-sqlite.wasm".
 * Confirmed against Expo's own SQLite docs (docs.expo.dev/versions/latest/sdk/sqlite)
 * — this is the documented, required fix, not a workaround.
 */
config.resolver.assetExts.push('wasm');

/**
 * wa-sqlite (expo-sqlite's web backend) needs SharedArrayBuffer, which
 * browsers only allow on cross-origin-isolated pages — these two headers
 * are what opts a page into that isolation. Without them, expo-sqlite
 * compiles and bundles fine (confirmed above) but fails at runtime the
 * moment a database is actually opened in the browser. Only affects the
 * dev server here; a real web deployment needs the same two headers set
 * by whatever's actually serving the static export (e.g. EAS Hosting's
 * header config, or your own server/CDN settings) — see Expo's SQLite
 * docs for the EAS Hosting example.
 */
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return middleware(req, res, next);
  };
};

/**
 * Supabase's RealtimeClient needs a WebSocket implementation, and on
 * Node.js < 22 (no native `WebSocket` global), Supabase's own currently
 * recommended fix is `npm i ws` + pass it via `realtime.transport`
 * (see github.com/orgs/supabase/discussions/37869, posted by a Supabase
 * maintainer — this is the sanctioned fix, not a workaround).
 *
 * `src/services/supabase/client.ts` does exactly that, gated behind a
 * runtime check (`globalThis.WebSocket === 'undefined'`) that's always
 * false on every real platform Metro bundles for — iOS, Android, and
 * modern browsers all provide a native `WebSocket` already. The branch
 * that imports `ws` is therefore dead code on every bundled target.
 *
 * The problem: Metro resolves `require`/`import` specifiers statically,
 * regardless of whether the branch containing them ever executes. `ws`
 * depends on Node-only core modules (`net`, `tls`, `stream`, `http`)
 * that have no React Native equivalent, so without this override, Metro
 * would try to resolve `ws` (and transitively, those Node core modules)
 * into the iOS/Android bundle and fail to build.
 *
 * This redirects `ws` to an empty module for every platform Metro
 * actually bundles the app for. It has zero effect on the dead-code
 * branch (which never runs there anyway) and zero effect on the
 * Metro/Node dev-server process itself, which resolves modules through
 * a separate mechanism, not this app-bundle resolver.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'ws') {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
