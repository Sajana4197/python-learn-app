import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Placeholder only. The full lesson reader (intro, explanation, code
 * sample, run/output, common mistakes, quiz, summary, next-lesson nav)
 * is built in Phase 3. This confirms the dynamic `[id]` route resolves
 * and receives params correctly before that real implementation lands.
 */
export default function LessonDetailPlaceholder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center gap-2 px-8"
      style={{ backgroundColor: colors.background }}
    >
      <Text variant="heading">Lesson {id}</Text>
      <Text variant="body" tone="secondary" className="text-center">
        The full lesson reader arrives in Phase 3.
      </Text>
    </View>
  );
}
