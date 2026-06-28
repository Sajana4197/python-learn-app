import React, { useState } from 'react';
import { TextInput, View, Pressable, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  errorMessage?: string;
  isPassword?: boolean;
}

/**
 * Base form input used by sign-in/sign-up and (later) settings/profile
 * forms. `isPassword` adds a show/hide toggle rather than leaving the
 * field permanently obscured — typos in a hidden password field are a
 * disproportionate source of failed sign-in attempts.
 */
export function TextField({
  label,
  errorMessage,
  isPassword = false,
  ...rest
}: TextFieldProps) {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(isPassword);
  const hasError = Boolean(errorMessage);

  return (
    <View className="gap-1.5">
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
      <View
        className="flex-row items-center rounded-md px-3"
        style={{
          backgroundColor: colors.surfaceAlt,
          borderWidth: 1,
          borderColor: hasError ? colors.danger : colors.border,
        }}
      >
        <TextInput
          className="flex-1 py-3 font-body text-base"
          style={{ color: colors.textPrimary }}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        {isPassword && (
          <Pressable
            onPress={() => setIsSecure((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            hitSlop={8}
          >
            {isSecure ? (
              <Eye color={colors.textSecondary} size={20} />
            ) : (
              <EyeOff color={colors.textSecondary} size={20} />
            )}
          </Pressable>
        )}
      </View>
      {hasError && (
        <Text variant="caption" tone="danger">
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
