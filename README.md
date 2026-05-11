# Inner Compass 🧭

> AI-powered journaling coach combining biblical psychology and behavioral science

[![CI/CD](https://github.com/Leonydis147/Inner-Compass/actions/workflows/ci.yml/badge.svg)](https://github.com/Leonydis147/Inner-Compass/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🧠 AI Coaching
- **Personalized Insights**: GPT-4 powered responses tailored to your journal entries
- **Contextual Memory**: Vector-based semantic search across all your past entries
- **Pattern Recognition**: Identifies recurring themes and emotional patterns

### 📊 Emotional Intelligence
- **Emotion Detection**: Automatic classification of emotions in your writing
- **Weekly Trends**: Visualize emotional patterns over time
- **Domain Classification**: Categorizes entries by life domains (work, relationships, spirituality, etc.)

### 🎭 Biblical Archetypes
Track your journey through biblical character patterns:
- **Cain** - Struggle with jealousy and anger
- **Jonah** - Resistance to calling/purpose
- **Solomon** - Wisdom and discernment
- **Moses** - Leadership and responsibility
- **Job** - Suffering and perseverance
- **David** - Courage and faith

### 🛡️ Safety First
- **Crisis Detection**: Identifies concerning language and provides immediate resources
- **988 Integration**: Direct access to crisis hotlines
- **Moderation API**: OpenAI content moderation for safety

### 💳 Subscription Plans
- **Basic**: Free tier with core features
- **Pro**: Advanced analytics, unlimited entries, priority support

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Supabase account
- OpenAI API key
- Stripe account (for subscriptions)

### Installation

```bash
# Clone the repository
git clone https://github.com/Leonydis147/Inner-Compass.git
cd Inner-Compass

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local

# Edit .env.local with your keys
# See "Environment Variables" section below

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
# OpenAI (Required)
OPENAI_API_KEY=sk-...

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe (Required for subscriptions)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Getting API Keys

1. **OpenAI**: https://platform.openai.com/api-keys
2. **Supabase**: https://supabase.com/dashboard/project/_/settings/api
3. **Stripe**: https://dashboard.stripe.com/apikeys

## 📁 Project Structure

```
inner-compass/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── coach/           # AI coaching endpoint
│   │   ├── transcribe/      # Audio transcription
│   │   ├── subscribe/       # Subscription management
│   │   └── webhooks/stripe/ # Stripe webhooks
│   ├── auth/                # Authentication pages
│   ├── journal/             # Journaling interface
│   ├── pricing/             # Subscription plans
│   └── subscription/        # Subscription management
├── components/              # Reusable React components
├── hooks/                   # Custom React hooks
├── lib/                     # Core utilities
│   ├── api.ts              # API handler wrapper
│   ├── analysis.ts         # Journal analysis
│   ├── archetype.ts        # Biblical archetype logic
│   ├── crisisResources.ts  # Crisis intervention
│   ├── memory.ts           # Vector memory
│   ├── prompts.ts          # AI prompts
│   ├── rateLimit.ts        # Rate limiting
│   └── stripe.ts           # Stripe integration
├── store/                   # Zustand state management
├── supabase/               # Database migrations
├── tests/                   # Vitest tests
└── utils/                   # Utility functions
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📝 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Environment Variables for Production

Add these in Vercel dashboard:

| Name | Environment |
|------|-------------|
| `OPENAI_API_KEY` | All |
| `SUPABASE_URL` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | All |
| `STRIPE_SECRET_KEY` | All |
| `STRIPE_PUBLISHABLE_KEY` | All |
| `STRIPE_WEBHOOK_SECRET` | All |
| `NEXT_PUBLIC_SUPABASE_URL` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All |

## 📊 Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the migration in `supabase/migrations/001_initial.sql`
3. Enable Row Level Security (already configured)

### Tables

- `profiles` - User profiles
- `journal_entries` - Journal entries with embeddings
- `emotions` - Emotion tracking
- `archetypes` - Biblical archetype patterns
- `subscriptions` - Stripe subscription data

## 🔒 Security

- Rate limiting on all API endpoints
- Security headers (HSTS, X-Frame-Options, CSP)
- Row Level Security in Supabase
- Environment variable validation
- Input sanitization
- HTTPS enforced in production

## 📈 Monitoring

- Vercel Analytics (enabled by default)
- Supabase query logs
- OpenAI usage dashboard
- Custom health check endpoint: `/api/health`

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/Inner-Compass.git

# Create branch
git checkout -b feature/your-feature

# Make changes, then:
npm run lint
npm test

# Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/your-feature
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Biblical psychology framework
- Behavioral science research
- OpenAI for GPT-4
- Supabase for database
- Stripe for payments
- Next.js team

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Leonydis147/Inner-Compass/issues)
- **Documentation**: [Wiki](https://github.com/Leonydis147/Inner-Compass/wiki)
- **Email**: [Your contact]

## 🌟 Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice journaling
- [ ] Group support circles
- [ ] Advanced analytics dashboard
- [ ] Export to PDF/Markdown
- [ ] Multi-language support
- [ ] AI model fine-tuning

---

**Built with ❤️ using Next.js, Supabase, and OpenAI**
