import React, { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

export interface SkeletonProps extends ViewProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

/**
 * Generic shimmering placeholder for loading states. Used anywhere content
 * is fetched asynchronously (lesson list, profile stats) so the layout
 * never pops/jumps once real content arrives — the skeleton should match
 * the real component's dimensions as closely as possible.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
  ...rest
}: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.surfaceAlt },
        animatedStyle,
        style,
      ]}
      {...rest}
    />
  );
}

/** Convenience preset matching a typical lesson-list row. */
export function SkeletonListRow() {
  return (
    <View className="flex-row items-center gap-3 p-4">
      <Skeleton width={40} height={40} borderRadius={20} />
      <View className="flex-1 gap-2">
        <Skeleton width="70%" height={14} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
}
