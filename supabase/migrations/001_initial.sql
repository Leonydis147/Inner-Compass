-- Enable vector similarity search
create extension if not exists vector;

-- Users table (extends Supabase auth)
create table user_profiles (
  id uuid references auth.users primary key,
  created_at timestamptz default now(),
  archetype_profile jsonb,
  preferences jsonb
);

-- Journal entries with vector embedding
create table journal_entries (
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

-- Index for vector similarity search
create index on journal_entries using ivfflat (embedding vector_cosine_ops);

-- Weekly trends aggregation
create table user_weekly_trends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  week_start date not null,
  emotion_distribution jsonb,
  archetype_frequency jsonb,
  domain_distribution jsonb,
  unique(user_id, week_start)
);

-- Archetype profiles
create table user_archetype_profiles (
  user_id uuid references auth.users primary key,
  primary_archetype text,
  secondary_archetype text,
  confidence_score numeric,
  updated_at timestamptz default now()
);

-- Coach feedback for A/B testing
create table coach_feedback (
  id uuid default gen_random_uuid() primary key,
  entry_id uuid references journal_entries,
  feedback_text text,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamptz default now()
);

-- A/B test events
create table ab_test_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  model_used text,
  latency_ms integer,
  input_length integer,
  response_length integer,
  timestamp timestamptz default now()
);

-- Rate limiting function
create or replace function check_rate_limit(p_user_id uuid)
returns boolean as $$
declare
  entry_count integer;
begin
  select count(*) into entry_count
  from journal_entries
  where user_id = p_user_id
    and created_at >= now() - interval '24 hours';
  
  return entry_count < 50; -- 50 entries per day limit
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

-- Row Level Security
alter table journal_entries enable row level security;
alter table user_profiles enable row level security;
alter table user_weekly_trends enable row level security;
alter table user_archetype_profiles enable row level security;
alter table coach_feedback enable row level security;
alter table ab_test_events enable row level security;

-- Policies (users can only access their own data)
create policy "Users can view own entries"
  on journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can view own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);
