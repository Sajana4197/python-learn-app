import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

export interface CodeBlockProps {
  code: string;
  label?: string;
}

/**
 * Plain monospace code display — not a syntax-highlighted editor. The
 * real interactive, syntax-highlighted, runnable editor is Phase 4's
 * job; this is read-only presentation for the lesson reader.
 */
export function CodeBlock({ code, label }: CodeBlockProps) {
  const { colors } = useTheme();

  return (
    <View>
      {label && (
        <Text variant="caption" tone="secondary" className="mb-1">
          {label}
        </Text>
      )}
      <View className="rounded-md p-3" style={{ backgroundColor: colors.codeBackground }}>
        <Text variant="code" style={{ color: colors.codeText }}>
          {code}
        </Text>
      </View>
    </View>
  );
}
