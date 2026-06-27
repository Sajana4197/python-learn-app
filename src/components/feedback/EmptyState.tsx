import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Shown whenever a list, search, or collection has nothing in it yet.
 * Per the app's content voice: an empty screen is an invitation to act,
 * not an apology — so copy passed in here should say what to do next
 * ("Bookmark a lesson to see it here"), not just "Nothing here."
 */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8 py-12">
      {icon}
      <Text variant="heading" className="text-center">
        {title}
      </Text>
      {description && (
        <Text variant="body" tone="secondary" className="text-center">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-2">
          <Button label={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      )}
    </View>
  );
}
