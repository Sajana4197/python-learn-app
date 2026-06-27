/**
 * Hand-maintained skeleton of the Supabase schema.
 *
 * In a real CI pipeline this would be generated via:
 *   npx supabase gen types typescript --project-id <id> > types.ts
 * We hand-write it here since no live project is wired up yet. Tables are
 * added incrementally, matching the phase that introduces them:
 *   - profiles        -> Phase 2 (auth)
 *   - user_progress   -> Phase 3 (lesson engine)
 *   - achievements    -> Phase 5 (gamification)
 *   - notes           -> Phase 6 (notes/bookmarks)
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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
