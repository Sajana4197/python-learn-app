import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Centralized, typed keys for AsyncStorage. SQLite (see `database.ts`) is
 * for structured/relational data (lessons, progress, notes). AsyncStorage
 * is reserved for small, simple preferences and flags only — this keeps a
 * single source of truth and avoids scattered magic-string keys.
 */
export const storageKeys = {
  themeMode: 'indent.theme.mode',
  hasCompletedOnboarding: 'indent.onboarding.completed',
  onboardingGoal: 'indent.onboarding.goal',
  lastActiveDate: 'indent.streak.lastActiveDate',
} as const;

export async function getBoolean(key: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(key);
  return value === 'true';
}

export async function setBoolean(key: string, value: boolean): Promise<void> {
  await AsyncStorage.setItem(key, value ? 'true' : 'false');
}

export async function getString(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function setString(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}
