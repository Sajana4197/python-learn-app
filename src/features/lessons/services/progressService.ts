import { getDatabase } from '@/services/storage/database';
import type { LessonProgress, LessonStatus } from '@/types/lesson';

/**
 * Local-first by design, matching the pattern already established for
 * the onboarding goal (see GoalScreen's comment): progress reads and
 * writes hit SQLite directly and instantly, with no network round-trip
 * on the critical path. Syncing this table to Supabase's
 * `user_lesson_progress` is real, planned work, but deferred to Phase 8
 * alongside the rest of cloud sync — bolting on a partial sync path here
 * would mean re-deciding the sync strategy twice.
 */

interface ProgressRow {
  lesson_id: string;
  status: LessonStatus;
  quiz_score: number | null;
  completed_at: string | null;
}

export async function getAllProgress(): Promise<Map<string, LessonProgress>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ProgressRow>('SELECT * FROM lesson_progress;');

  const map = new Map<string, LessonProgress>();
  for (const row of rows) {
    map.set(row.lesson_id, {
      lessonId: row.lesson_id,
      status: row.status,
      quizScore: row.quiz_score,
      completedAt: row.completed_at,
    });
  }
  return map;
}

export async function getProgressForLesson(lessonId: string): Promise<LessonProgress | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ProgressRow>(
    'SELECT * FROM lesson_progress WHERE lesson_id = ?;',
    [lessonId]
  );
  if (!row) return null;

  return {
    lessonId: row.lesson_id,
    status: row.status,
    quizScore: row.quiz_score,
    completedAt: row.completed_at,
  };
}

export async function markLessonInProgress(lessonId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO lesson_progress (lesson_id, status, updated_at)
     VALUES (?, 'in_progress', datetime('now'))
     ON CONFLICT(lesson_id) DO UPDATE SET
       status = CASE WHEN lesson_progress.status = 'completed' THEN 'completed' ELSE 'in_progress' END,
       updated_at = datetime('now');`,
    [lessonId]
  );
}

/**
 * Marks a lesson completed. `quizScore` is the number of correct answers
 * out of the lesson's total quiz questions — stored for the future
 * profile/stats screens (Phase 8), not currently displayed anywhere.
 */
export async function markLessonCompleted(lessonId: string, quizScore: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO lesson_progress (lesson_id, status, quiz_score, completed_at, updated_at)
     VALUES (?, 'completed', ?, datetime('now'), datetime('now'))
     ON CONFLICT(lesson_id) DO UPDATE SET
       status = 'completed',
       quiz_score = excluded.quiz_score,
       completed_at = excluded.completed_at,
       updated_at = excluded.updated_at;`,
    [lessonId, quizScore]
  );
}
