import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export interface SocialSignInButtonProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  isLoading?: boolean;
}

/**
 * Shared shell for Google/Apple sign-in entry points. Deliberately
 * neutral-toned (uses theme surface/border, not the brand accent) since
 * platform sign-in buttons conventionally stay visually quiet rather
 * than competing with the app's own primary action color.
 */
export function SocialSignInButton({ label, icon, onPress, isLoading = false }: SocialSignInButtonProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: isLoading }}
      onPress={handlePress}
      disabled={isLoading}
      className="flex-row items-center justify-center gap-3 rounded-lg px-5 py-3.5"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isLoading ? <ActivityIndicator color={colors.textPrimary} /> : icon}
      <Text variant="bodyMedium">{label}</Text>
    </Pressable>
  );
}
