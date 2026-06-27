import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getBoolean, storageKeys } from '@/services/storage/preferences';
import { useAppReadinessStore } from '@/store/appReadinessStore';

/**
 * The app's true entry point. Decides, once, whether to send a person to
 * onboarding or straight into the tabs. This indirection (rather than
 * checking inside `_layout.tsx`) keeps the root layout focused purely on
 * providers/fonts, per the separation-of-concerns rule for this codebase.
 */
export default function Index() {
  const hasCompletedOnboarding = useAppReadinessStore((s) => s.hasCompletedOnboarding);
  const setHasCompletedOnboarding = useAppReadinessStore((s) => s.setHasCompletedOnboarding);
  const [isChecked, setIsChecked] = useState(hasCompletedOnboarding !== null);

  useEffect(() => {
    if (hasCompletedOnboarding !== null) return;
    getBoolean(storageKeys.hasCompletedOnboarding)
      .then(setHasCompletedOnboarding)
      .finally(() => setIsChecked(true));
  }, [hasCompletedOnboarding, setHasCompletedOnboarding]);

  if (!isChecked) {
    return null;
  }

  return hasCompletedOnboarding ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(onboarding)/welcome" />
  );
}
