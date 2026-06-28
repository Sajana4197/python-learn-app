import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { TriangleAlert } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeProvider';

const consequences = [
  'If you uninstall the app or clear its data, your streak, XP, and lesson progress are gone for good.',
  "You can't pick up where you left off on a different phone or tablet.",
  "There's no way to recover your progress if this device is lost, reset, or breaks.",
];

/**
 * Shown after choosing "Continue as guest" on AccountChoiceScreen, before
 * any progress can be created. Per product decision, this is a dedicated
 * screen rather than a native Alert — a transient OS dialog doesn't give
 * enough room to actually explain the tradeoff, and it's easy to dismiss
 * without reading. This screen requires an explicit tap to proceed.
 */
export function GuestWarningScreen() {
  const { colors } = useTheme();

  return (
    <View className="flex-1 justify-between px-6 pb-10 pt-16" style={{ backgroundColor: colors.background }}>
      <View>
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.dangerSurface }}
        >
          <TriangleAlert color={colors.danger} size={24} />
        </View>

        <Text variant="heading" className="mt-4">
          Before you continue as a guest
        </Text>
        <Text variant="body" tone="secondary" className="mt-1">
          Guest mode works fully offline, but it comes with real
          tradeoffs:
        </Text>

        <View className="mt-4 gap-3">
          {consequences.map((line, index) => (
            <View key={index} className="flex-row gap-2">
              <Text variant="body" tone="danger">
                •
              </Text>
              <Text variant="body" tone="secondary" className="flex-1">
                {line}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3">
        <Button
          label="Create an account instead"
          size="lg"
          onPress={() => router.replace('/(auth)/sign-up')}
        />
        <Button
          label="Continue as guest anyway"
          variant="ghost"
          size="lg"
          onPress={() => router.push('/(onboarding)/goal')}
        />
      </View>
    </View>
  );
}
