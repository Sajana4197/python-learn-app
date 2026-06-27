import { create } from 'zustand';

interface AppReadinessState {
  hasCompletedOnboarding: boolean | null; // null = not yet checked
  fontsLoaded: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  setFontsLoaded: (value: boolean) => void;
}

/**
 * Drives the splash -> onboarding -> tabs routing decision in
 * `app/_layout.tsx`. `hasCompletedOnboarding` starts `null` (unknown,
 * still reading from AsyncStorage) rather than `false`, so the router
 * never briefly flashes onboarding for a returning user before the real
 * value loads.
 */
export const useAppReadinessStore = create<AppReadinessState>((set) => ({
  hasCompletedOnboarding: null,
  fontsLoaded: false,
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  setFontsLoaded: (value) => set({ fontsLoaded: value }),
}));
