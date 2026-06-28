import { supabase, isSupabaseConfigured } from '@/services/supabase/client';
import type { SignInFormValues, SignUpFormValues } from '../types/schemas';

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Translates raw Supabase auth errors into copy a learner (not a
 * developer) should see. Falls through to the original message for cases
 * we haven't special-cased, so we never silently swallow useful detail.
 */
function toFriendlyMessage(rawMessage: string): string {
  const lower = rawMessage.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'That email and password don\u2019t match an account.';
  }
  if (lower.includes('user already registered')) {
    return 'An account with that email already exists. Try signing in instead.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Check your inbox to confirm your email before signing in.';
  }
  if (lower.includes('rate limit')) {
    return 'Too many attempts. Wait a moment and try again.';
  }
  return rawMessage;
}

function unconfiguredResult(): AuthResult {
  return {
    success: false,
    error:
      'Sign-in isn\u2019t set up yet on this build. You can continue as a guest instead.',
  };
}

export async function signUpWithEmail({
  email,
  password,
}: SignUpFormValues): Promise<AuthResult> {
  if (!isSupabaseConfigured) return unconfiguredResult();

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { success: false, error: toFriendlyMessage(error.message) };
  }
  return { success: true };
}

export async function signInWithEmail({
  email,
  password,
}: SignInFormValues): Promise<AuthResult> {
  if (!isSupabaseConfigured) return unconfiguredResult();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, error: toFriendlyMessage(error.message) };
  }
  return { success: true };
}

export async function signOut(): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { success: true };

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: toFriendlyMessage(error.message) };
  }
  return { success: true };
}

/**
 * Exchanges a Google or Apple identity token for a Supabase session.
 * Both OAuth providers funnel into this one call — only how the token
 * was obtained differs (browser redirect for Google, native prompt for
 * Apple), not how it's redeemed.
 */
export async function signInWithIdToken(
  provider: 'google' | 'apple',
  idToken: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured) return unconfiguredResult();

  const { error } = await supabase.auth.signInWithIdToken({ provider, token: idToken });
  if (error) {
    return { success: false, error: toFriendlyMessage(error.message) };
  }
  return { success: true };
}
