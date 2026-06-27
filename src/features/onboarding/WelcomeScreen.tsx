import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * First screen a new person sees. Uses staggered, indented code-style
 * lines (`def`, the body, `return`) as the hero visual instead of a
 * generic illustration — a quiet, immediate demonstration of the brand's
 * "indentation as identity" idea before any copy explains it.
 */
const heroLines = [
  { text: 'def learn_python():', indent: 0 },
  { text: 'while curious:', indent: 1 },
  { text: 'practice()', indent: 2 },
  { text: 'return mastery', indent: 1 },
];

export function WelcomeScreen() {
  const { colors } = useTheme();

  return (
    <View className="flex-1 justify-between px-6 pb-10 pt-20" style={{ backgroundColor: colors.background }}>
      <View>
        <View
          className="self-start rounded-md px-3 py-2"
          style={{ backgroundColor: colors.codeBackground }}
        >
          {heroLines.map((line, index) => (
            <Text
              key={index}
              variant="code"
              style={{ color: colors.codeText, marginLeft: line.indent * 16 }}
            >
              {line.text}
            </Text>
          ))}
        </View>

        <Text variant="display" className="mt-10">
          Indent
        </Text>
        <Text variant="body" tone="secondary" className="mt-2">
          Code, line by line. Learn real Python with hands-on lessons, an
          editor that never loses your place, and an AI tutor that explains
          instead of just answering.
        </Text>
      </View>

      <View className="gap-3">
        <Button
          label="Get started"
          size="lg"
          onPress={() => router.push('/(onboarding)/goal')}
        />
        <Button
          label="I already have an account"
          variant="ghost"
          size="lg"
          onPress={() => router.push('/(auth)/sign-in')}
        />
      </View>
    </View>
  );
}
