import React from 'react';
import { Code2 } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/components/feedback/PlaceholderScreen';

export default function EditorTab() {
  const { colors } = useTheme();
  return (
    <PlaceholderScreen
      icon={<Code2 color={colors.accentPrimary} size={32} />}
      title="The code playground is coming"
      description="A real Python editor with offline execution arrives in Phase 4."
    />
  );
}
