import React from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Map } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { SkeletonListRow } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useTheme } from '@/theme/ThemeProvider';
import { useRoadmap } from './hooks/useRoadmap';
import { ModuleSection } from './components/ModuleSection';

export function RoadmapScreen() {
  const { colors } = useTheme();
  const { modules, isLoading } = useRoadmap();

  const handleLessonPress = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerClassName="px-5 pb-10 pt-16 gap-8"
    >
      <View>
        <Text variant="display">Roadmap</Text>
        <Text variant="body" tone="secondary" className="mt-1">
          Python Fundamentals
        </Text>
      </View>

      {isLoading ? (
        <View className="gap-2">
          <SkeletonListRow />
          <SkeletonListRow />
          <SkeletonListRow />
        </View>
      ) : modules.length === 0 ? (
        <EmptyState
          icon={<Map color={colors.textSecondary} size={32} />}
          title="No lessons yet"
          description="Lessons sync automatically once you're online. Check your connection and reopen the app."
        />
      ) : (
        modules.map((mod) => (
          <ModuleSection key={mod.module.id} data={mod} onLessonPress={handleLessonPress} />
        ))
      )}
    </ScrollView>
  );
}
