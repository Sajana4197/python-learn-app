import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { signInWithIdToken, type AuthResult } from './authService';

/**
 * Sign in with Apple is iOS-only — there's no Android or web equivalent,
 * and Apple's own guidelines don't require offering it outside iOS.
 * Callers should check `isAppleSignInAvailable()` before rendering an
 * Apple button at all, rather than rendering it and failing on tap.
 *
 * Setup required:
 *   1. Enable "Sign In with Apple" capability in your Apple Developer
 *      account for this app's bundle identifier.
 *   2. In Supabase dashboard (Authentication > Providers), enable Apple
 *      and provide your Services ID, Team ID, Key ID, and private key
 *      per Supabase's Apple provider setup instructions.
 *   3. The `expo-apple-authentication` config plugin (already added in
 *      app.json) sets the required entitlement automatically on build.
 */
export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  return AppleAuthentication.isAvailableAsync();
}

export async function signInWithApple(): Promise<AuthResult> {
  try {
    const nonce = Math.random().toString(36).slice(2, 14);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!credential.identityToken) {
      return {
        success: false,
        error: 'Apple didn\u2019t return a valid sign-in token. Try again.',
      };
    }

    return signInWithIdToken('apple', credential.identityToken);
  } catch (err) {
    const isUserCancelled =
      err instanceof Error && err.message.includes('ERR_REQUEST_CANCELED');
    if (isUserCancelled) {
      // The person tapped "Cancel" on the system prompt — not an error.
      return { success: false };
    }
    return {
      success: false,
      error: 'Apple sign-in didn\u2019t complete. Try again.',
    };
  }
}
