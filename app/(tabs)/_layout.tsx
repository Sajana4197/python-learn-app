import React from 'react';
import { Tabs } from 'expo-router';
import { House, Map, Code, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { TabBarIcon } from '@/components/ui/TabBarIcon';

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 56 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={<House color={color} size={size} />} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="roadmap"
        options={{
          title: 'Roadmap',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={<Map color={color} size={size} />} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Editor',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={<Code color={color} size={size} />} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={<User color={color} size={size} />} isFocused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
