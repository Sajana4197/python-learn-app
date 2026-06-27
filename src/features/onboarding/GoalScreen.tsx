import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';
import { setBoolean, storageKeys } from '@/services/storage/preferences';
import { useAppReadinessStore } from '@/store/appReadinessStore';

interface Goal {
  id: string;
  title: string;
  description: string;
}

const goals: Goal[] = [
  {
    id: 'beginner',
    title: 'Start from zero',
    description: "I've never written a line of code.",
  },
  {
    id: 'student',
    title: 'Support my coursework',
    description: "I'm studying CS or a related subject.",
  },
  {
    id: 'interview',
    title: 'Prepare for interviews',
    description: 'I know some Python and want to get sharper.',
  },
];

/**
 * Captures the person's learning goal, which later phases (the roadmap
 * generator in Phase 3, and difficulty-adjustment in the AI tutor in
 * Phase 7) use to tailor what's shown first. For Phase 1 this only
 * persists the selection locally; wiring it into the roadmap happens once
 * the roadmap itself exists.
 */
export function GoalScreen() {
  const { colors } = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const setHasCompletedOnboarding = useAppReadinessStore((s) => s.setHasCompletedOnboarding);

  const handleContinue = async () => {
    await setBoolean(storageKeys.hasCompletedOnboarding, true);
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1 px-6 pb-10 pt-16" style={{ backgroundColor: colors.background }}>
      <Text variant="heading">What brings you to Indent?</Text>
      <Text variant="body" tone="secondary" className="mt-1">
        This shapes which lessons we show first. You can change it later in
        Settings.
      </Text>

      <View className="mt-6 gap-3">
        {goals.map((goal) => {
          const isSelected = goal.id === selectedId;
          return (
            <Pressable key={goal.id} onPress={() => setSelectedId(goal.id)}>
              <Card
                style={{
                  borderColor: isSelected ? colors.accentPrimary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                }}
              >
                <Text variant="subheading">{goal.title}</Text>
                <Text variant="caption" tone="secondary" className="mt-1">
                  {goal.description}
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-auto">
        <Button
          label="Continue"
          size="lg"
          disabled={!selectedId}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
