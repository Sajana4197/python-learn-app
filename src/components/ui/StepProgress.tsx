import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { indentSteps } from '@/theme/tokens';

export type StepStatus = 'completed' | 'active' | 'locked';

export interface StepProgressItem {
  id: string;
  status: StepStatus;
}

export interface StepProgressProps {
  items: StepProgressItem[];
  renderItem: (item: StepProgressItem, index: number) => React.ReactNode;
}

/**
 * The brand's signature element: a vertical trail where each item is
 * offset further right than the last, capped at `maxVisibleLevels` before
 * resetting — visually echoing Python's indentation blocks instead of a
 * generic circular progress ring or plain vertical list. Used by the
 * lesson roadmap (Phase 3) and onboarding (this phase).
 */
export function StepProgress({ items, renderItem }: StepProgressProps) {
  const { colors } = useTheme();

  return (
    <View>
      {items.map((item, index) => {
        const level = index % indentSteps.maxVisibleLevels;
        const offset = indentSteps.baseOffset + level * indentSteps.stepOffset;
        const isLast = index === items.length - 1;

        return (
          <View key={item.id} style={{ marginLeft: offset }} className="flex-row">
            <View className="items-center" style={{ width: 28 }}>
              <View
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    item.status === 'completed'
                      ? colors.success
                      : item.status === 'active'
                        ? colors.accentPrimary
                        : colors.border,
                }}
              />
              {!isLast && (
                <View
                  className="w-px flex-1"
                  style={{ backgroundColor: colors.border, minHeight: 24 }}
                />
              )}
            </View>
            <View className="flex-1 pb-4 pl-2">{renderItem(item, index)}</View>
          </View>
        );
      })}
    </View>
  );
}
