import React from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

const sizeClassName: Record<Size, string> = {
  sm: 'px-3 py-2 rounded-md',
  md: 'px-5 py-3.5 rounded-lg',
  lg: 'px-6 py-4 rounded-xl',
};

const sizeTextVariant: Record<Size, 'caption' | 'bodyMedium' | 'subheading'> = {
  sm: 'caption',
  md: 'bodyMedium',
  lg: 'subheading',
};

/**
 * Primary interactive control across the app. Every tap target meets the
 * 44pt minimum (size="md" and "lg" both clear it); `size="sm"` is reserved
 * for dense inline contexts like editor toolbars, never primary actions.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  onPress,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || isLoading;

  const backgroundColor: Record<Variant, string> = {
    primary: colors.accentPrimary,
    secondary: colors.surfaceAlt,
    ghost: 'transparent',
    danger: colors.danger,
  };

  const textTone: Record<Variant, 'primary' | 'inverse' | 'danger' | 'accent'> = {
    primary: 'inverse',
    secondary: 'primary',
    ghost: 'accent',
    danger: 'inverse',
  };

  const handlePress: PressableProps['onPress'] = (event) => {
    if (isDisabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      onPress={handlePress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center gap-2 ${sizeClassName[size]}`}
      style={[
        {
          backgroundColor: variant === 'primary' && isDisabled
            ? colors.border
            : backgroundColor[variant],
          opacity: isDisabled && variant !== 'primary' ? 0.5 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: colors.border,
        },
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={textTone[variant] === 'inverse' ? colors.textInverse : colors.accentPrimary}
        />
      ) : (
        <>
          {leftIcon}
          <Text variant={sizeTextVariant[size]} tone={textTone[variant]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
