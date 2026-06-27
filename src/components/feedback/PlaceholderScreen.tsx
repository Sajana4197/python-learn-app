import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

export interface PlaceholderScreenProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Shared shell for tabs whose real implementation lands in a later phase.
 * Exists so every tab route is navigable and visually consistent from
 * Phase 1 onward, rather than a blank screen or a crash.
 */
export function PlaceholderScreen({ icon, title, description }: PlaceholderScreenProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center gap-3 px-8"
      style={{ backgroundColor: colors.background }}
    >
      {icon}
      <Text variant="heading" className="text-center">
        {title}
      </Text>
      <Text variant="body" tone="secondary" className="text-center">
        {description}
      </Text>
    </View>
  );
}
