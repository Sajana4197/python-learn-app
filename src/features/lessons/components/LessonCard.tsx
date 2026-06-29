import React from 'react';
import { Pressable, View } from 'react-native';
import { CircleCheckBig, Lock, CirclePlay } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';
import type { RoadmapLesson } from '../hooks/useRoadmap';

export interface LessonCardProps {
  lesson: RoadmapLesson;
  isLocked: boolean;
  onPress: () => void;
}

/**
 * A lesson is "locked" when an earlier lesson in the same module hasn't
 * been completed yet — computed by the roadmap screen from sort order,
 * not stored as its own field, so there's one source of truth for
 * progress (status) rather than two that could drift out of sync.
 */
export function LessonCard({ lesson, isLocked, onPress }: LessonCardProps) {
  const { colors } = useTheme();

  const statusIcon = isLocked ? (
    <Lock color={colors.textSecondary} size={20} />
  ) : lesson.status === 'completed' ? (
    <CircleCheckBig color={colors.success} size={20} />
  ) : (
    <CirclePlay color={colors.accentPrimary} size={20} />
  );

  return (
    <Pressable onPress={isLocked ? undefined : onPress} disabled={isLocked}>
      <Card style={{ opacity: isLocked ? 0.5 : 1 }} className="flex-row items-center gap-3">
        {statusIcon}
        <View className="flex-1">
          <Text variant="subheading">{lesson.title}</Text>
          <Text variant="caption" tone="secondary" className="mt-0.5">
            {lesson.summary}
          </Text>
        </View>
        <Text variant="caption" tone="secondary">
          {lesson.estimatedMinutes}m
        </Text>
      </Card>
    </Pressable>
  );
}
