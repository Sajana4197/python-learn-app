import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { supabase, isSupabaseConfigured } from '@/services/supabase/client';
import type { AuthResult } from './authService';

WebBrowser.maybeCompleteAuthSession();

/**
 * Google sign-in goes through Supabase's own OAuth redirect flow rather
 * than a separate Google SDK: Supabase opens Google's consent screen in
 * an in-app browser, Google redirects back to our `indent://` scheme with
 * a session embedded in the URL, and we hand that URL to Supabase to
 * finalize the session. This avoids needing a native Google Sign-In SDK
 * and its associated config (google-services.json, etc.) entirely — the
 * tradeoff is the visible browser hand-off instead of a fully native
 * button, which is a fine default for this app's needs.
 *
 * Setup required in the Supabase dashboard (Authentication > Providers):
 *   1. Enable the Google provider.
 *   2. Create an OAuth 2.0 Client ID in Google Cloud Console
 *      (type: Web application).
 *   3. Add the Client ID + Secret to Supabase's Google provider settings.
 *   4. In Google Cloud Console, add Supabase's callback URL
 *      (shown in the Supabase dashboard next to the Google toggle) as an
 *      authorized redirect URI.
 *   5. In Supabase Authentication > URL Configuration, add `indent://`
 *      to the list of allowed redirect URLs.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error:
        'Sign-in isn\u2019t set up yet on this build. You can continue as a guest instead.',
    };
  }

  const redirectTo = Linking.createURL('/');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error || !data?.url) {
    return {
      success: false,
      error: error?.message ?? 'Couldn\u2019t start Google sign-in. Try again.',
    };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success' || !result.url) {
    // 'cancel' or 'dismiss' means the person backed out — not an error
    // worth surfacing loudly.
    return { success: false };
  }

  // Supabase returns the session tokens in the URL's #fragment, not the
  // ?query string. `expo-linking`'s Linking.parse() only reads the query
  // string and silently misses fragment params, so we use
  // expo-auth-session's getQueryParams helper instead — it's built
  // specifically to handle both shapes. This is the pattern documented
  // in Supabase's own native deep-linking guide.
  const { params, errorCode } = QueryParams.getQueryParams(result.url);

  if (errorCode) {
    return {
      success: false,
      error: 'Google sign-in didn\u2019t complete. Try again.',
    };
  }

  if (!params.access_token || !params.refresh_token) {
    return {
      success: false,
      error: 'Google sign-in didn\u2019t return a valid session. Try again.',
    };
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: params.access_token,
    refresh_token: params.refresh_token,
  });

  if (sessionError) {
    return { success: false, error: sessionError.message };
  }

  return { success: true };
}
