import { supabase, isSupabaseConfigured } from '@/services/supabase/client';
import { getDatabase } from '@/services/storage/database';
import type { LessonContent, LessonDetail, LessonSummary, Module } from '@/types/lesson';

/**
 * Read path is always SQLite-first: the roadmap and lesson reader never
 * block on a network call. `syncLessonsFromSupabase` is called once on
 * app start (see `useLessonSync`) to refresh the local cache when a
 * connection is available; if it fails (offline, misconfigured, first
 * run with no connectivity yet), whatever was cached from a previous
 * successful sync is still fully usable.
 */

interface CachedModuleRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
}

interface CachedLessonRow {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  summary: string;
  sort_order: number;
  estimated_minutes: number;
  xp_reward: number;
  content: string;
}

export async function syncLessonsFromSupabase(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase isn\u2019t configured.' };
  }

  const [{ data: modules, error: modulesError }, { data: lessons, error: lessonsError }] =
    await Promise.all([
      supabase.from('modules').select('*').order('sort_order'),
      supabase.from('lessons').select('*').order('sort_order'),
    ]);

  if (modulesError || lessonsError) {
    return { success: false, error: (modulesError ?? lessonsError)?.message };
  }
  if (!modules || !lessons) {
    return { success: false, error: 'No data returned.' };
  }

  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    for (const mod of modules) {
      await db.runAsync(
        `INSERT INTO cached_modules (id, slug, title, description, sort_order)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           slug = excluded.slug,
           title = excluded.title,
           description = excluded.description,
           sort_order = excluded.sort_order;`,
        [mod.id, mod.slug, mod.title, mod.description, mod.sort_order]
      );
    }

    for (const lesson of lessons) {
      await db.runAsync(
        `INSERT INTO cached_lessons
           (id, module_id, slug, title, summary, sort_order, estimated_minutes, xp_reward, content)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           module_id = excluded.module_id,
           slug = excluded.slug,
           title = excluded.title,
           summary = excluded.summary,
           sort_order = excluded.sort_order,
           estimated_minutes = excluded.estimated_minutes,
           xp_reward = excluded.xp_reward,
           content = excluded.content;`,
        [
          lesson.id,
          lesson.module_id,
          lesson.slug,
          lesson.title,
          lesson.summary,
          lesson.sort_order,
          lesson.estimated_minutes,
          lesson.xp_reward,
          JSON.stringify(lesson.content),
        ]
      );
    }
  });

  return { success: true };
}

export async function getModulesWithLessons(): Promise<
  { module: Module; lessons: LessonSummary[] }[]
> {
  const db = await getDatabase();

  const moduleRows = await db.getAllAsync<CachedModuleRow>(
    'SELECT * FROM cached_modules ORDER BY sort_order;'
  );
  const lessonRows = await db.getAllAsync<CachedLessonRow>(
    'SELECT * FROM cached_lessons ORDER BY sort_order;'
  );

  return moduleRows.map((mod) => ({
    module: {
      id: mod.id,
      slug: mod.slug,
      title: mod.title,
      description: mod.description,
      sortOrder: mod.sort_order,
    },
    lessons: lessonRows
      .filter((lesson) => lesson.module_id === mod.id)
      .map((lesson) => ({
        id: lesson.id,
        moduleId: lesson.module_id,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        sortOrder: lesson.sort_order,
        estimatedMinutes: lesson.estimated_minutes,
        xpReward: lesson.xp_reward,
      })),
  }));
}

export async function getLessonById(lessonId: string): Promise<LessonDetail | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<CachedLessonRow>(
    'SELECT * FROM cached_lessons WHERE id = ?;',
    [lessonId]
  );
  if (!row) return null;

  let content: LessonContent;
  try {
    content = JSON.parse(row.content) as LessonContent;
  } catch {
    return null;
  }

  return {
    id: row.id,
    moduleId: row.module_id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    sortOrder: row.sort_order,
    estimatedMinutes: row.estimated_minutes,
    xpReward: row.xp_reward,
    content,
  };
}

/**
 * Finds the lesson immediately after the given one within the same
 * module's sort order — used by the lesson reader's "Next lesson" action.
 * Returns null when the given lesson is the last one in its module (the
 * roadmap screen, not this function, decides what happens at the end of
 * a module — e.g. returning to the roadmap, or a future "next module"
 * transition once that UX is designed).
 */
export async function getNextLessonId(currentLessonId: string): Promise<string | null> {
  const db = await getDatabase();
  const current = await db.getFirstAsync<CachedLessonRow>(
    'SELECT * FROM cached_lessons WHERE id = ?;',
    [currentLessonId]
  );
  if (!current) return null;

  const next = await db.getFirstAsync<{ id: string }>(
    `SELECT id FROM cached_lessons
     WHERE module_id = ? AND sort_order > ?
     ORDER BY sort_order ASC
     LIMIT 1;`,
    [current.module_id, current.sort_order]
  );
  return next?.id ?? null;
}
