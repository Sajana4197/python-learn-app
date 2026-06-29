import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';
import { LessonCard } from './LessonCard';
import type { RoadmapModule } from '../hooks/useRoadmap';

export interface ModuleSectionProps {
  data: RoadmapModule;
  onLessonPress: (lessonId: string) => void;
}

/**
 * A lesson is locked when any earlier lesson in the same module (by
 * sort order) isn't yet completed — computed here, not stored, so
 * progress status remains the single source of truth.
 */
export function ModuleSection({ data, onLessonPress }: ModuleSectionProps) {
  const { colors } = useTheme();
  const completedCount = data.lessons.filter((l) => l.status === 'completed').length;

  return (
    <View className="gap-3">
      <View>
        <Text variant="heading">{data.module.title}</Text>
        <Text variant="caption" tone="secondary" className="mt-0.5">
          {data.module.description}
        </Text>
        <Text variant="caption" style={{ color: colors.accentSecondary }} className="mt-1">
          {completedCount} / {data.lessons.length} complete
        </Text>
      </View>

      <View className="gap-2">
        {data.lessons.map((lesson, index) => {
          const isLocked = index > 0 && data.lessons[index - 1]?.status !== 'completed';
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isLocked={isLocked}
              onPress={() => onLessonPress(lesson.id)}
            />
          );
        })}
      </View>
    </View>
  );
}
