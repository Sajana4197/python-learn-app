import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Lightbulb, TriangleAlert } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';
import { getLessonById, getNextLessonId } from './services/lessonsService';
import { markLessonCompleted, markLessonInProgress } from './services/progressService';
import { CodeBlock } from './components/CodeBlock';
import { LessonQuiz } from './components/LessonQuiz';
import type { LessonDetail } from '@/types/lesson';

export interface LessonScreenProps {
  lessonId: string;
}

type ReaderStage = 'reading' | 'quiz' | 'complete';

export function LessonScreen({ lessonId }: LessonScreenProps) {
  const { colors } = useTheme();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState<ReaderStage>('reading');
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getLessonById(lessonId).then((result) => {
      if (!isMounted) return;
      setLesson(result);
      setIsLoading(false);
      if (result) {
        markLessonInProgress(result.id);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const handleStartQuiz = () => setStage('quiz');

  const handleQuizComplete = async (correctCount: number) => {
    if (!lesson) return;
    await markLessonCompleted(lesson.id, correctCount);
    const next = await getNextLessonId(lesson.id);
    setNextLessonId(next);
    setStage('complete');
  };

  const handleNextLesson = () => {
    if (nextLessonId) {
      router.replace(`/lesson/${nextLessonId}`);
    } else {
      router.replace('/(tabs)/roadmap');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text variant="body" tone="secondary">
          Loading lesson…
        </Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View
        className="flex-1 items-center justify-center gap-2 px-8"
        style={{ backgroundColor: colors.background }}
      >
        <Text variant="heading">Lesson not found</Text>
        <Text variant="body" tone="secondary" className="text-center">
          This lesson may not have synced to this device yet. Check your
          connection and try again.
        </Text>
        <Button label="Back to roadmap" onPress={() => router.replace('/(tabs)/roadmap')} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerClassName="px-5 pb-12 pt-16 gap-6"
    >
      <View>
        <Text variant="caption" tone="secondary">
          {lesson.estimatedMinutes} min · {lesson.xpReward} XP
        </Text>
        <Text variant="display" className="mt-1">
          {lesson.title}
        </Text>
      </View>

      {stage === 'reading' && (
        <>
          <Text variant="body">{lesson.content.introduction}</Text>
          <Text variant="body" tone="secondary">
            {lesson.content.explanation}
          </Text>

          {lesson.content.visualExamples.length > 0 && (
            <View className="gap-3">
              {lesson.content.visualExamples.map((example, index) => (
                <CodeBlock key={index} label={example.label} code={example.code} />
              ))}
            </View>
          )}

          <View className="gap-2">
            <Text variant="subheading">Try it</Text>
            <CodeBlock code={lesson.content.codeExample.code} />
            <CodeBlock label="Output" code={lesson.content.codeExample.expectedOutput} />
          </View>

          {lesson.content.commonMistakes.length > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <TriangleAlert color={colors.danger} size={18} />
                <Text variant="subheading">Common mistakes</Text>
              </View>
              {lesson.content.commonMistakes.map((mistake, index) => (
                <Card key={index} style={{ backgroundColor: colors.dangerSurface }}>
                  <Text variant="bodyMedium">{mistake.mistake}</Text>
                  <Text variant="caption" tone="secondary" className="mt-1">
                    {mistake.why}
                  </Text>
                </Card>
              ))}
            </View>
          )}

          {lesson.content.tips.length > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Lightbulb color={colors.accentPrimary} size={18} />
                <Text variant="subheading">Tips</Text>
              </View>
              {lesson.content.tips.map((tip, index) => (
                <Text key={index} variant="body" tone="secondary">
                  • {tip}
                </Text>
              ))}
            </View>
          )}

          <Button label="Take the quiz" size="lg" onPress={handleStartQuiz} />
        </>
      )}

      {stage === 'quiz' && (
        <LessonQuiz questions={lesson.content.quiz} onComplete={handleQuizComplete} />
      )}

      {stage === 'complete' && (
        <View className="gap-4">
          <Card style={{ backgroundColor: colors.successSurface }}>
            <Text variant="subheading" tone="success">
              Lesson complete! +{lesson.xpReward} XP
            </Text>
          </Card>
          <View>
            <Text variant="subheading">Summary</Text>
            <Text variant="body" tone="secondary" className="mt-1">
              {lesson.content.summary}
            </Text>
          </View>
          <Button
            label={nextLessonId ? 'Next lesson' : 'Back to roadmap'}
            size="lg"
            onPress={handleNextLesson}
          />
        </View>
      )}
    </ScrollView>
  );
}
