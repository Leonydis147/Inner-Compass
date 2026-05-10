# Deployment Guide - Inner Compass on Vercel

## Prerequisites

- GitHub account
- Vercel account
- Supabase account
- OpenAI API key

## Step 1: Set Up Supabase

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and API keys

### 1.2 Run Migrations
1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `supabase/migrations/001_initial.sql`
3. Run the migration

### 1.3 Configure RLS
The migration already enables Row Level Security. Verify:
- Users can only access their own data
- Service role key bypasses RLS (for server-side operations)

## Step 2: Prepare GitHub Repository

```bash
cd inner-compass
git init
git add .
git commit -m "Initial commit: Inner Compass app"
git remote add origin https://github.com/yourusername/inner-compass.git
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Framework preset: **Next.js** (auto-detected)

### 3.2 Configure Environment Variables

In Vercel project settings → Environment Variables, add:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Production, Preview, Development |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Production, Preview, Development |
| `FINE_TUNE_MODEL_ID` | `ft:...` (optional) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview, Development |

### 3.3 Deploy
Click "Deploy". Vercel will:
- Install dependencies
- Run `next build`
- Deploy to production URL

## Step 4: Configure Function Settings

The `vercel.json` already configures:
- `/api/coach` route: 60s timeout, 1024MB memory

For high-traffic apps, consider upgrading to Pro plan for:
- Longer function timeouts (up to 60s on Hobby, 900s on Pro)
- More concurrent executions

## Step 5: Post-Deployment

### 5.1 Test Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

### 5.2 Test Coaching Endpoint
```bash
curl -X POST https://your-app.vercel.app/api/coach \
  -H "Content-Type: application/json" \
  -d '{"journalText": "Test entry", "userId": "test-user"}'
```

### 5.3 Set Up Custom Domain (Optional)
1. Vercel → Project Settings → Domains
2. Add your domain
3. Configure DNS as instructed

## Step 6: Monitoring

### 6.1 Vercel Analytics
Enable in Vercel dashboard for:
- Function execution times
- Error rates
- Traffic analytics

### 6.2 Supabase Logs
Monitor in Supabase dashboard:
- Database query performance
- Authentication events
- Function logs

### 6.3 OpenAI Usage
Track in OpenAI dashboard:
- Token usage
- API costs
- Rate limits

## Troubleshooting

### Build Fails
- Check `npm run build` locally first
- Ensure all TypeScript errors are resolved
- Verify all imports are correct

### API Timeout
- Increase `maxDuration` in `vercel.json`
- Optimize OpenAI calls (use smaller models where possible)
- Consider caching embeddings

### Database Connection Issues
- Verify Supabase URL is correct (no trailing slash)
- Check service role key has correct permissions
- Ensure RLS policies allow server-side access

## Cost Estimates

**Vercel Hobby (Free)**:
- 100GB bandwidth/month
- Unlimited serverless functions
- 100GB-hours compute

**Supabase Free Tier**:
- 500MB database
- 50,000 monthly active users
- 2GB file storage

**OpenAI** (varies by usage):
- GPT-3.5-turbo: ~$0.002/1K tokens
- GPT-4-turbo: ~$0.01/1K tokens
- Embeddings: ~$0.0001/1K tokens
- Moderation: Free

Estimated monthly cost for 1000 daily users: $50-150

## Security Checklist

- [ ] Service role key never exposed to client
- [ ] RLS policies properly configured
- [ ] Rate limiting enabled
- [ ] CORS configured for your domain
- [ ] Environment variables secured
- [ ] Error messages don't leak sensitive info
