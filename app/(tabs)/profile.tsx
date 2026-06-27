import React from 'react';
import { User } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/components/feedback/PlaceholderScreen';

export default function ProfileTab() {
  const { colors } = useTheme();
  return (
    <PlaceholderScreen
      icon={<User color={colors.textSecondary} size={32} />}
      title="Your profile is on its way"
      description="Certificates, interview prep, and settings arrive in Phase 8."
    />
  );
}
