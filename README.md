# Inner Compass

AI-powered journaling coach combining biblical psychology and behavioral science.

## Features

- 🧠 **AI Coaching** - Personalized insights using GPT-4
- 📊 **Emotion Detection** - Automatic emotion classification
- 🎭 **Archetype Tracking** - Biblical archetype patterns (Cain, Jonah, Solomon, Moses, Job, David)
- 🔍 **Vector Memory** - Semantic search across past entries
- 🛡️ **Safety First** - Crisis detection with resources
- 📈 **Weekly Trends** - Pattern recognition over time

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes, OpenAI API
- **Database**: Supabase (PostgreSQL + pgvector)
- **Deployment**: Vercel

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:
- `OPENAI_API_KEY` - OpenAI API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

### 3. Set up Supabase

1. Create a new Supabase project
2. Run the migration in `supabase/migrations/001_initial.sql`
3. Enable Row Level Security (already configured in migration)

### 4. Run development server

```bash
npm run dev
```

Visit http://localhost:3000

## Deployment on Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See `DEPLOYMENT.md` for detailed instructions.

## Project Structure

```
inner-compass/
├── app/
│   ├── api/          # API routes
│   ├── auth/         # Authentication pages
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Main journaling page
├── components/       # React components
├── hooks/            # Custom React hooks
├── lib/              # Core logic (AI, safety, vector, etc.)
├── store/            # Zustand state management
├── supabase/
│   └── migrations/   # Database migrations
└── public/           # Static assets
```

## API Endpoints

- `POST /api/coach` - Get AI coaching response (streaming)
- `POST /api/transcribe` - Audio transcription (Whisper)
- `POST /api/coach-feedback` - Submit feedback on coaching
- `POST /api/circle-insights` - Get insights for support circle
- `GET /api/health` - Health check

## Safety & Crisis Response

The app includes built-in crisis detection:
- OpenAI Moderation API
- Keyword fallback detection
- Immediate crisis resources (988, Crisis Text Line)

## License

MIT
