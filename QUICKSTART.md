# Quick Start - Inner Compass

## 5-Minute Setup

### 1. Install & Configure
```bash
cd inner-compass
npm install
cp .env.example .env.local
```

### 2. Get Your Keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Supabase**: https://supabase.com/dashboard/project/_/settings/api

### 3. Set Up Supabase
1. Create new project at supabase.com
2. Go to SQL Editor
3. Run `supabase/migrations/001_initial.sql`

### 4. Update .env.local
```env
OPENAI_API_KEY=sk-your-key-here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Locally
```bash
npm run dev
```
Visit http://localhost:3000

## Deploy to Vercel

```bash
# Push to GitHub
git init && git add . && git commit -m "Initial"
git remote add origin https://github.com/you/inner-compass.git
git push -u origin main

# Deploy
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variables
# 4. Click Deploy
```

## File Reference

| File | Purpose |
|------|---------|
| `app/api/coach/route.ts` | Main AI coaching endpoint |
| `lib/safety.ts` | Crisis detection & moderation |
| `lib/vector.ts` | Embedding & similarity search |
| `lib/archetype.ts` | Biblical archetype analysis |
| `supabase/migrations/001_initial.sql` | Database schema |

## Need Help?

- **Docs**: See `README.md` and `DEPLOYMENT.md`
- **Supabase Issues**: Check RLS policies in migration
- **API Errors**: Verify environment variables
- **Build Fails**: Run `npm run build` locally first
