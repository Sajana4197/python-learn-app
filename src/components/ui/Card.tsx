import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
}

/**
 * Base surface for grouped content: lesson cards, stat tiles, settings
 * rows. Deliberately has no elevation/shadow by default — the design
 * language relies on flat color contrast (surface vs surfaceAlt vs
 * background) rather than drop shadows, which keeps dark mode clean.
 */
export function Card({ children, padded = true, style, ...rest }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      className={`rounded-lg ${padded ? 'p-4' : ''}`}
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
