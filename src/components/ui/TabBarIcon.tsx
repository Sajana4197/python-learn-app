import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface TabBarIconProps {
  icon: React.ReactNode;
  isFocused: boolean;
}

/**
 * Wraps a tab icon with a small dot indicator above it when active,
 * instead of relying solely on icon/label color change (which is harder
 * to notice at a glance, especially for color-vision-deficient users —
 * shape + color together is a stronger signal than color alone).
 */
export function TabBarIcon({ icon, isFocused }: TabBarIconProps) {
  const { colors } = useTheme();

  return (
    <View className="items-center" style={{ width: 32 }}>
      <View
        className="rounded-full"
        style={{
          width: 4,
          height: 4,
          marginBottom: 4,
          backgroundColor: isFocused ? colors.accentPrimary : 'transparent',
        }}
      />
      {icon}
    </View>
  );
}
