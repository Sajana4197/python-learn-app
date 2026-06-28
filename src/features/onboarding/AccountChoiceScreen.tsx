import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { CloudOff, UserPlus } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Sits between Welcome and Goal selection. Makes the guest-vs-account
 * tradeoff an explicit choice rather than defaulting silently into guest
 * mode — per product decision, guests must see what they're giving up
 * (via GuestWarningScreen) before proceeding, rather than just tapping
 * past it without realizing there was a choice at all.
 */
export function AccountChoiceScreen() {
  const { colors } = useTheme();

  return (
    <View className="flex-1 px-6 pb-10 pt-16" style={{ backgroundColor: colors.background }}>
      <Text variant="heading">How do you want to start?</Text>
      <Text variant="body" tone="secondary" className="mt-1">
        You can switch this later — creating an account never costs you
        progress.
      </Text>

      <View className="mt-6 gap-3">
        <Card>
          <View className="flex-row items-center gap-2">
            <UserPlus color={colors.accentSecondary} size={20} />
            <Text variant="subheading">Create an account</Text>
          </View>
          <Text variant="caption" tone="secondary" className="mt-1">
            Your progress, streak, and XP back up automatically and sync
            if you switch devices.
          </Text>
          <View className="mt-3">
            <Button
              label="Create an account"
              onPress={() => router.push('/(auth)/sign-up')}
            />
          </View>
        </Card>

        <Card>
          <View className="flex-row items-center gap-2">
            <CloudOff color={colors.textSecondary} size={20} />
            <Text variant="subheading">Continue as guest</Text>
          </View>
          <Text variant="caption" tone="secondary" className="mt-1">
            Start right away, no account needed. Progress stays on this
            device only.
          </Text>
          <View className="mt-3">
            <Button
              label="Continue as guest"
              variant="ghost"
              onPress={() => router.push('/(onboarding)/guest-warning')}
            />
          </View>
        </Card>
      </View>
    </View>
  );
}
