import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'indent.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Migrations are append-only and run in order. Each one is idempotent
 * (CREATE TABLE IF NOT EXISTS) so re-running on an already-migrated DB is
 * always safe. New migrations are added here as later phases introduce new
 * local tables (lesson progress in Phase 3, notes/bookmarks in Phase 6, etc).
 */
const migrations: { version: number; statements: string[] }[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );`,
    ],
  },
  {
    version: 2,
    statements: [
      // Mirrors Supabase's `modules`/`lessons` tables for offline reading.
      // `content` stores the lesson's JSONB body as a serialized TEXT blob
      // (SQLite has no native JSON column type) — parsed back into
      // `LessonContent` on read by the lessons service, never read raw
      // by UI code directly.
      `CREATE TABLE IF NOT EXISTS cached_modules (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        sort_order INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS cached_lessons (
        id TEXT PRIMARY KEY NOT NULL,
        module_id TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        estimated_minutes INTEGER NOT NULL,
        xp_reward INTEGER NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (module_id) REFERENCES cached_modules(id) ON DELETE CASCADE
      );`,
      `CREATE INDEX IF NOT EXISTS cached_lessons_module_id_idx ON cached_lessons(module_id);`,
      // Local-first progress: this table is the actual source of truth
      // the app reads from at all times, even when signed in — Supabase's
      // user_lesson_progress is a sync target, not the primary read path.
      // This keeps progress instant and fully offline-safe.
      `CREATE TABLE IF NOT EXISTS lesson_progress (
        lesson_id TEXT PRIMARY KEY NOT NULL,
        status TEXT NOT NULL DEFAULT 'not_started'
          CHECK (status IN ('not_started', 'in_progress', 'completed')),
        quiz_score INTEGER,
        completed_at TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        -- Tracks whether this row has been pushed to Supabase yet, so the
        -- (Phase 8) sync layer knows what's pending without re-uploading
        -- everything on every sync pass.
        synced_at TEXT
      );`,
    ],
  },
];

async function getCurrentVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version;'
  );
  return result?.user_version ?? 0;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const currentVersion = await getCurrentVersion(db);
  const pending = migrations.filter((m) => m.version > currentVersion);

  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      for (const statement of migration.statements) {
        await db.execAsync(statement);
      }
    });
    await db.execAsync(`PRAGMA user_version = ${migration.version};`);
  }
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await runMigrations(db);

  dbInstance = db;
  return db;
}

/** Exposed for tests and the future "reset progress" settings action. */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}
