import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { CircleCheckBig, CircleX } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';
import type { QuizQuestion } from '@/types/lesson';

export interface LessonQuizProps {
  questions: QuizQuestion[];
  onComplete: (correctCount: number) => void;
}

/**
 * One question at a time rather than a scrollable list of all questions —
 * keeps focus on a single decision and makes the "did I get it right"
 * feedback immediate rather than deferred to a final results screen,
 * which matters more for learning retention than a single combined score
 * reveal would.
 */
export function LessonQuiz({ questions, onComplete }: LessonQuizProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const question = questions[currentIndex];
  if (!question) return null;

  const hasAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.correctIndex;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedIndex(index);
    if (index === question.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(correctCount);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
  };

  return (
    <View className="gap-3">
      <Text variant="caption" tone="secondary">
        Question {currentIndex + 1} of {questions.length}
      </Text>
      <Text variant="subheading">{question.question}</Text>

      <View className="gap-2">
        {question.options.map((option, index) => {
          const isSelected = index === selectedIndex;
          const isCorrectOption = index === question.correctIndex;
          const showCorrect = hasAnswered && isCorrectOption;
          const showIncorrect = hasAnswered && isSelected && !isCorrectOption;

          return (
            <Pressable key={index} onPress={() => handleSelect(index)} disabled={hasAnswered}>
              <Card
                className="flex-row items-center gap-2"
                style={{
                  borderColor: showCorrect
                    ? colors.success
                    : showIncorrect
                      ? colors.danger
                      : colors.border,
                  borderWidth: showCorrect || showIncorrect ? 2 : 1,
                }}
              >
                {showCorrect && <CircleCheckBig color={colors.success} size={18} />}
                {showIncorrect && <CircleX color={colors.danger} size={18} />}
                <Text variant="body" className="flex-1">
                  {option}
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </View>

      {hasAnswered && (
        <Card style={{ backgroundColor: isCorrect ? colors.successSurface : colors.dangerSurface }}>
          <Text variant="bodyMedium" tone={isCorrect ? 'success' : 'danger'}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </Text>
          <Text variant="caption" tone="secondary" className="mt-1">
            {question.explanation}
          </Text>
        </Card>
      )}

      {hasAnswered && (
        <Button label={isLastQuestion ? 'Finish quiz' : 'Next question'} onPress={handleNext} />
      )}
    </View>
  );
}
