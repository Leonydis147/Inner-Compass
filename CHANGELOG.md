# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-11

### Added
- **Core Features**
  - AI-powered journaling coach with GPT-4 integration
  - Biblical archetype tracking (Cain, Jonah, Solomon, Moses, Job, David)
  - Emotion detection and classification
  - Vector memory for semantic search across journal entries
  - Crisis detection with immediate resource suggestions
  - Weekly trend analysis and pattern recognition
  - Support circle insights

- **Authentication & Security**
  - Supabase authentication with SSR support
  - Row Level Security (RLS) policies
  - Rate limiting on all API endpoints
  - Security headers (HSTS, X-Frame-Options, CSP)
  - Environment variable validation

- **Subscription & Billing**
  - Stripe integration for subscription management
  - Basic and Pro tier plans
  - Webhook handling for payment events
  - Subscription verification endpoints

- **Developer Experience**
  - TypeScript strict mode configuration
  - ESLint + Prettier setup
  - Vitest testing framework
  - GitHub Actions CI/CD pipeline
  - Husky git hooks
  - Comprehensive documentation

- **Performance**
  - Next.js 15 with React 19
  - Optimized package imports
  - Image optimization with AVIF/WebP
  - Static asset caching strategies

### Changed
- Upgraded to Next.js 15 from 14
- Upgraded to React 19 from 18
- Updated all dependencies to latest stable versions
- Improved error handling across all API routes
- Enhanced rate limiting with better headers

### Fixed
- TypeScript target compatibility (ES2020)
- NextResponse import in middleware
- Invalid API response limit configuration
- Environment variable handling

### Security
- Added rate limiting to prevent abuse
- Implemented security headers
- Removed sensitive data from version control
- Added npm audit to CI pipeline

## [0.1.0] - 2026-05-10

### Added
- Initial project setup
- Basic journaling functionality
- OpenAI integration
- Supabase database setup
- Stripe payment integration
- Next.js App Router structure

---

## Version Guidelines

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible features
- **PATCH** version for backwards-compatible bug fixes

**Example:**
- `1.0.0` - Production release
- `1.1.0` - New features (archetype tracking)
- `1.1.1` - Bug fixes (emotion detection accuracy)
