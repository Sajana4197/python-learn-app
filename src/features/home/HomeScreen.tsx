import React from 'react';
import { ScrollView, View } from 'react-native';
import { Flame, Star, Trophy } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';

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
 * Home dashboard. Stat values below are static placeholders — wired to
 * the real local SQLite progress tables once Phase 3 (lesson engine) and
 * Phase 5 (gamification/XP) exist. The layout, components, and theming
 * are final; only the data source changes later.
 */
export function HomeScreen() {
  const { colors } = useTheme();

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
        <Text variant="body" tone="secondary" className="mt-1">
          Your lesson roadmap will appear here once the lesson engine ships
          in Phase 3.
        </Text>
      </Card>
    </ScrollView>
  );
}
