import React from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Flame, Star, Trophy } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/feedback/Skeleton';
import { useTheme } from '@/theme/ThemeProvider';
import { useRoadmap, findNextLesson } from '@/features/lessons/hooks/useRoadmap';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="flex-1 items-start gap-2">
      {icon}
      <Text variant="display" style={{ fontSize: 22 }}>
        {value}
      </Text>
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
    </Card>
  );
}

/**
 * Home dashboard. Streak/XP/Level stat values are still static
 * placeholders — wired to real data once Phase 5 (gamification) exists.
 * "Continue learning" is wired to real roadmap/progress data now that
 * Phase 3's lesson engine exists.
 */
export function HomeScreen() {
  const { colors } = useTheme();
  const { modules, isLoading } = useRoadmap();
  const nextLesson = findNextLesson(modules);
  const hasAnyLessons = modules.some((m) => m.lessons.length > 0);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerClassName="px-5 pb-10 pt-16 gap-6"
    >
      <View>
        <Text variant="caption" tone="secondary">
          Welcome back
        </Text>
        <Text variant="display">Let&apos;s write some Python.</Text>
      </View>

      <View className="flex-row gap-3">
        <StatCard
          icon={<Flame color={colors.accentPrimary} size={20} />}
          label="Day streak"
          value="0"
        />
        <StatCard
          icon={<Star color={colors.accentSecondary} size={20} />}
          label="Total XP"
          value="0"
        />
        <StatCard
          icon={<Trophy color={colors.success} size={20} />}
          label="Level"
          value="1"
        />
      </View>

      <Card>
        <Text variant="subheading">Continue learning</Text>

        {isLoading ? (
          <View className="mt-3 gap-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="100%" height={36} />
          </View>
        ) : !hasAnyLessons ? (
          <Text variant="body" tone="secondary" className="mt-1">
            Lessons sync automatically once you&apos;re online. Check your
            connection and reopen the app.
          </Text>
        ) : nextLesson ? (
          <>
            <Text variant="body" tone="secondary" className="mt-1">
              {nextLesson.title}
            </Text>
            <View className="mt-3">
              <Button
                label="Continue"
                onPress={() => router.push(`/lesson/${nextLesson.id}`)}
              />
            </View>
          </>
        ) : (
          <Text variant="body" tone="secondary" className="mt-1">
            You&apos;ve completed every lesson so far. More are on the way.
          </Text>
        )}
      </Card>
    </ScrollView>
  );
}
