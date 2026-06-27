import React from 'react';
import { Map } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/components/feedback/PlaceholderScreen';

export default function RoadmapTab() {
  const { colors } = useTheme();
  return (
    <PlaceholderScreen
      icon={<Map color={colors.accentSecondary} size={32} />}
      title="Your roadmap is being built"
      description="The lesson roadmap, with progress tracking, arrives in Phase 3."
    />
  );
}
