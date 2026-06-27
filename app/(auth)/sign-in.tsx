import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Placeholder only. Real sign-in form (React Hook Form + Zod validation,
 * Supabase auth call, error states) is built in Phase 2. This exists now
 * so the route is navigable and the onboarding flow doesn't dead-end.
 */
export default function SignInPlaceholder() {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center gap-3 px-8"
      style={{ backgroundColor: colors.background }}
    >
      <Text variant="heading">Sign in</Text>
      <Text variant="body" tone="secondary" className="text-center">
        Account sign-in arrives in Phase 2. For now, continue as a guest —
        your progress still saves on this device.
      </Text>
      <Button label="Continue as guest" onPress={() => router.replace('/(tabs)/home')} />
    </View>
  );
}
