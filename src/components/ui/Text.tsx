import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Variant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'code';

type Tone = 'primary' | 'secondary' | 'inverse' | 'accent' | 'success' | 'danger';

export interface TextProps extends RNTextProps {
  variant?: Variant;
  tone?: Tone;
  children: React.ReactNode;
}

const variantClassName: Record<Variant, string> = {
  display: 'font-display text-3xl leading-tight',
  heading: 'font-display-semibold text-xl leading-snug',
  subheading: 'font-body-semibold text-base leading-snug',
  body: 'font-body text-base leading-normal',
  bodyMedium: 'font-body-medium text-base leading-normal',
  caption: 'font-body text-sm leading-normal',
  code: 'font-mono text-sm leading-relaxed',
};

/**
 * Themed text primitive. Always prefer this over react-native's bare
 * `Text` so color follows the active theme automatically — hardcoding a
 * color via `style` defeats dark mode and should only happen for
 * one-off cases (and even then, pull the hex from `theme/tokens`).
 */
export function Text({ variant = 'body', tone = 'primary', style, children, ...rest }: TextProps) {
  const { colors } = useTheme();

  const toneColor: Record<Tone, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    inverse: colors.textInverse,
    accent: colors.accentPrimary,
    success: colors.success,
    danger: colors.danger,
  };

  return (
    <RNText
      className={variantClassName[variant]}
      style={[{ color: toneColor[tone] }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
