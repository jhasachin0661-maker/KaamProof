# Supabase CLI & Migrations Guidelines

## Best Practices
- Manage SQL migrations under `supabase/migrations/` using timestamped SQL files.
- Apply migrations locally using `supabase db reset` or `supabase migration up`.
- Configure Row Level Security (RLS) policies explicitly on all tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
