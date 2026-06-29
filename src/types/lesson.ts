/**
 * Mirrors `supabase/migrations/001_lesson_schema.sql`. Keep both in sync
 * by hand — there's no codegen step for this yet (Phase 9 could add
 * `supabase gen types` if a live project becomes the source of truth
 * during CI).
 */

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface LessonSummary {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  summary: string;
  sortOrder: number;
  estimatedMinutes: number;
  xpReward: number;
}

/**
 * The rich body of a lesson, stored as the `lessons.content` JSONB column.
 * Mirrors the lesson structure mandated in the product spec: intro,
 * explanation, visual examples, code, output, common mistakes, tips,
 * quiz, summary. "Next lesson" isn't part of this shape — it's derived
 * at render time from `sortOrder` within the module instead of stored
 * redundantly here.
 */
export interface LessonContent {
  introduction: string;
  explanation: string;
  /** Short illustrative snippets that aren't the main runnable example — e.g. "x = 5" inline. */
  visualExamples: VisualExample[];
  codeExample: CodeExample;
  commonMistakes: CommonMistake[];
  tips: string[];
  quiz: QuizQuestion[];
  summary: string;
}

export interface VisualExample {
  label: string;
  code: string;
}

export interface CodeExample {
  /** The main runnable snippet for this lesson, shown with a Run button in the reader. */
  code: string;
  /** Expected stdout when run as-is, shown in the lesson reader's static "Output" panel (not live-executed until Phase 4's real interpreter lands). */
  expectedOutput: string;
}

export interface CommonMistake {
  mistake: string;
  why: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index into `options`. */
  correctIndex: number;
  explanation: string;
}

export interface LessonDetail extends LessonSummary {
  content: LessonContent;
}

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  quizScore: number | null;
  completedAt: string | null;
}
