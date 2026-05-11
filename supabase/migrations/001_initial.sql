-- ============================================
-- Inner Compass Database Schema
-- Version: 1.0.0
-- Description: Complete database setup for AI journaling coach
-- ============================================

-- Enable vector similarity search (pgvector extension)
create extension if not exists vector;

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth)
create table if not exists user_profiles (
  id uuid references auth.users primary key,
  created_at timestamptz default now(),
  archetype_profile jsonb,
  preferences jsonb,
  email text,
  stripe_subscription_id text,
  subscription_status text default 'free'
);

-- Journal entries with vector embedding
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  embedding vector(1536),
  detected_emotion text,
  life_domain text,
  archetype_scores jsonb,
  circle_id uuid,
  created_at timestamptz default now()
);

-- Weekly trends aggregation
create table if not exists user_weekly_trends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  week_start date not null,
  emotion_distribution jsonb,
  archetype_frequency jsonb,
  domain_distribution jsonb,
  unique(user_id, week_start)
);

-- Archetype profiles
create table if not exists user_archetype_profiles (
  user_id uuid references auth.users primary key,
  primary_archetype text,
  secondary_archetype text,
  confidence_score numeric,
  updated_at timestamptz default now()
);

-- Coach feedback for A/B testing
create table if not exists coach_feedback (
  id uuid default gen_random_uuid() primary key,
  entry_id uuid references journal_entries,
  feedback_text text,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamptz default now()
);

-- A/B test events
create table if not exists ab_test_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  model_used text,
  latency_ms integer,
  input_length integer,
  response_length integer,
  timestamp timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for vector similarity search
create index if not exists journal_entries_embedding_idx 
  on journal_entries using ivfflat (embedding vector_cosine_ops);

-- Index for user lookups
create index if not exists journal_entries_user_id_idx 
  on journal_entries (user_id);

-- Index for created_at sorting
create index if not exists journal_entries_created_at_idx 
  on journal_entries (created_at desc);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Rate limiting function (50 entries per day)
create or replace function check_rate_limit(p_user_id uuid)
returns boolean as $$
declare
  entry_count integer;
begin
  select count(*) into entry_count
  from journal_entries
  where user_id = p_user_id
    and created_at >= now() - interval '24 hours';
  
  return entry_count < 50;
end;
$$ language plpgsql security definer;

-- Vector similarity search function
create or replace function match_journal_entries(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_id_input uuid
)
returns table (
  id uuid,
  content text,
  created_at timestamptz,
  similarity float
) as $$
begin
  return query
  select
    journal_entries.id,
    journal_entries.content,
    journal_entries.created_at,
    1 - (journal_entries.embedding <=> query_embedding) as similarity
  from journal_entries
  where journal_entries.user_id = user_id_input
    and 1 - (journal_entries.embedding <=> query_embedding) > match_threshold
  order by journal_entries.embedding <=> query_embedding
  limit match_count;
end;
$$ language plpgsql security definer;

-- Insert journal entry with embedding
create or replace function insert_journal_entry(
  p_user_id uuid,
  p_content text,
  p_domain text,
  p_archetype_scores jsonb
)
returns uuid as $$
declare
  v_embedding vector(1536);
  v_id uuid;
begin
  -- Generate embedding (requires OpenAI API call - done in application layer)
  -- This is a placeholder - in production, generate embedding before calling this
  v_embedding := null;
  
  insert into journal_entries (user_id, content, embedding, life_domain, archetype_scores)
  values (p_user_id, p_content, v_embedding, p_domain, p_archetype_scores)
  returning id into v_id;
  
  return v_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table journal_entries enable row level security;
alter table user_profiles enable row level security;
alter table user_weekly_trends enable row level security;
alter table user_archetype_profiles enable row level security;
alter table coach_feedback enable row level security;
alter table ab_test_events enable row level security;

-- ============================================
-- POLICIES
-- ============================================

-- Journal entries policies
drop policy if exists "Users can view own entries" on journal_entries;
create policy "Users can view own entries"
  on journal_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own entries" on journal_entries;
create policy "Users can insert own entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own entries" on journal_entries;
create policy "Users can delete own entries"
  on journal_entries for delete
  using (auth.uid() = user_id);

-- User profiles policies
drop policy if exists "Users can view own profile" on user_profiles;
create policy "Users can view own profile"
  on user_profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on user_profiles;
create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on user_profiles;
create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- Weekly trends policies
drop policy if exists "Users can view own trends" on user_weekly_trends;
create policy "Users can view own trends"
  on user_weekly_trends for select
  using (auth.uid() = user_id);

-- Archetype profiles policies
drop policy if exists "Users can view own archetype profile" on user_archetype_profiles;
create policy "Users can view own archetype profile"
  on user_archetype_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own archetype profile" on user_archetype_profiles;
create policy "Users can update own archetype profile"
  on user_archetype_profiles for update
  using (auth.uid() = user_id);

-- Coach feedback policies
drop policy if exists "Users can view own feedback" on coach_feedback;
create policy "Users can view own feedback"
  on coach_feedback for select
  using (
    exists (
      select 1 from journal_entries
      where journal_entries.id = coach_feedback.entry_id
      and journal_entries.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert feedback" on coach_feedback;
create policy "Users can insert feedback"
  on coach_feedback for insert
  with check (
    exists (
      select 1 from journal_entries
      where journal_entries.id = coach_feedback.entry_id
      and journal_entries.user_id = auth.uid()
    )
  );

-- A/B test events policies
drop policy if exists "Users can view own test events" on ab_test_events;
create policy "Users can view own test events"
  on ab_test_events for select
  using (auth.uid()::text = user_id::text);

drop policy if exists "Service can insert test events" on ab_test_events;
create policy "Service can insert test events"
  on ab_test_events for insert
  with check (true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_archetype_profiles_updated_at
  before update on user_archetype_profiles
  for each row
  execute function update_updated_at_column();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default archetype options (optional)
-- Uncomment if you want a reference table for archetypes
/*
create table if not exists archetypes (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  traits jsonb
);

insert into archetypes (name, description, traits) values
  ('Cain', 'Struggle with jealousy and anger', '{"shadow": "resentment", "growth": "acceptance"}'),
  ('Jonah', 'Resistance to calling/purpose', '{"shadow": "avoidance", "growth": "obedience"}'),
  ('Solomon', 'Wisdom and discernment', '{"shadow": "excess", "growth": "balance"}'),
  ('Moses', 'Leadership and responsibility', '{"shadow": "doubt", "growth": "faith"}'),
  ('Job', 'Suffering and perseverance', '{"shadow": "despair", "growth": "hope"}'),
  ('David', 'Courage and faith', '{"shadow": "impulse", "growth": "repentance"}');
*/

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- This migration is complete. All tables, functions, indexes, and policies are created.
-- Next steps:
-- 1. Enable Row Level Security in Supabase dashboard (already enabled in this script)
-- 2. Configure environment variables in your application
-- 3. Test the database connection
