/**
 * Hand-maintained skeleton of the Supabase schema.
 *
 * In a real CI pipeline this would be generated via:
 *   npx supabase gen types typescript --project-id <id> > types.ts
 * We hand-write it here since no live project is wired up yet. Tables are
 * added incrementally, matching the phase that introduces them:
 *   - profiles              -> Phase 2 (auth) — see supabase/migrations/000_profiles.sql
 *   - modules, lessons,
 *     user_lesson_progress  -> Phase 3 (lesson engine) — see supabase/migrations/001_lesson_schema.sql
 *   - achievements          -> Phase 5 (gamification)
 *   - notes                 -> Phase 6 (notes/bookmarks)
 *
 * Column names stay snake_case here, matching Postgres exactly — the
 * app-facing camelCase types in `src/types/lesson.ts` are mapped from
 * these in `src/features/lessons/services/lessonsService.ts`, not used
 * as a 1:1 substitute for this file.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          sort_order: number;
          created_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          slug: string;
          title: string;
          summary: string;
          sort_order: number;
          estimated_minutes: number;
          xp_reward: number;
          content: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          slug: string;
          title: string;
          summary: string;
          sort_order: number;
          estimated_minutes?: number;
          xp_reward?: number;
          content: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          module_id?: string;
          slug?: string;
          title?: string;
          summary?: string;
          sort_order?: number;
          estimated_minutes?: number;
          xp_reward?: number;
          content?: unknown;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
        ];
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: 'not_started' | 'in_progress' | 'completed';
          quiz_score: number | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: 'not_started' | 'in_progress' | 'completed';
          quiz_score?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'not_started' | 'in_progress' | 'completed';
          quiz_score?: number | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
