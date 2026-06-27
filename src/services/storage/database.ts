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
