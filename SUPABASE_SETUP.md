# Supabase Setup Guide

This guide will help you set up the Supabase database for Inner Compass.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project**: Create a new Supabase project

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Inner Compass
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"

### 2. Run Database Migrations

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to your project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Copy the contents of `supabase/migrations/001_initial.sql`
5. Paste into the editor
6. Click **"Run"** or press `Ctrl+Enter`

#### Option B: Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 3. Enable Vector Extension

The migration includes `create extension if not exists vector;` which enables pgvector for semantic search.

If you get an error, manually enable it:

1. Go to **Extensions** in Supabase dashboard
2. Search for "vector" or "pgvector"
3. Click **Enable**

### 4. Configure Row Level Security (RLS)

The migration enables RLS on all tables. Verify:

1. Go to **Authentication** → **Policies**
2. Check that policies exist for:
   - `journal_entries`
   - `user_profiles`
   - `user_weekly_trends`
   - `user_archetype_profiles`
   - `coach_feedback`
   - `ab_test_events`

### 5. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (for frontend)
   - **service_role key**: `eyJhbG...` (for backend - keep secret!)

### 6. Configure Environment Variables

Create or update `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key
```

## Database Schema Overview

### Tables

| Table | Description |
|-------|-------------|
| `user_profiles` | User metadata and preferences |
| `journal_entries` | Journal entries with vector embeddings |
| `user_weekly_trends` | Aggregated weekly analytics |
| `user_archetype_profiles` | Biblical archetype assignments |
| `coach_feedback` | User feedback on AI coaching |
| `ab_test_events` | A/B testing analytics |

### Key Functions

| Function | Purpose |
|----------|---------|
| `check_rate_limit(user_id)` | Enforces 50 entries/day limit |
| `match_journal_entries(query_embedding, threshold, count, user_id)` | Vector similarity search |

### Indexes

- **Vector Index**: `journal_entries.embedding` - IVFFlat index for fast similarity search
- **Standard Indexes**: Created automatically on foreign keys

## Testing the Setup

### 1. Test Database Connection

```bash
# Install Supabase JS client
npm install @supabase/supabase-js

# Create test script
cat > test-supabase.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.from('user_profiles').select('count');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✓ Database connection successful!');
  }
}

test();
EOF

# Run test
node test-supabase.js
```

### 2. Test Vector Search

```sql
-- In Supabase SQL Editor
SELECT 
  id,
  content,
  1 - (embedding <=> '[0.1, 0.2, 0.3, ...]'::vector) as similarity
FROM journal_entries
WHERE user_id = 'your-user-uuid'
ORDER BY embedding <=> '[0.1, 0.2, 0.3, ...]'::vector
LIMIT 5;
```

## Troubleshooting

### Error: "relation does not exist"

**Solution**: Run the migration SQL script in Supabase SQL Editor.

### Error: "permission denied for table"

**Solution**: Check that RLS policies are correctly set up. Users can only access their own data.

### Error: "extension 'vector' does not exist"

**Solution**: 
1. Go to Extensions in Supabase dashboard
2. Enable the `vector` (pgvector) extension
3. Re-run the migration

### Error: "function match_journal_entries does not exist"

**Solution**: The function creation failed. Re-run the migration SQL.

## Next Steps

1. ✅ **Set up authentication** - Supabase Auth is ready to use
2. ✅ **Configure Stripe** - Add Stripe keys for subscriptions
3. ✅ **Add OpenAI key** - For AI coaching features
4. ✅ **Deploy to Vercel** - Import your GitHub repo

## Useful SQL Queries

### Check table row counts
```sql
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
WHERE schemaname = 'public';
```

### View RLS policies
```sql
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Check vector extension
```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

## Support

- **Supabase Docs**: https://supabase.com/docs
- **pgvector Docs**: https://github.com/pgvector/pgvector
- **Inner Compass Issues**: https://github.com/Leonydis147/Inner-Compass/issues
