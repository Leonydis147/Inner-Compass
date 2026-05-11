# Contributing to Inner Compass

Thank you for your interest in contributing! This guide will help you get started.

## 🌟 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

**Example:**
```markdown
**Bug**: Emotion detection returns incorrect results for short entries

**Steps to Reproduce:**
1. Go to journal page
2. Enter text: "I feel okay"
3. Submit for analysis

**Expected:** Neutral or mild emotion
**Actual:** Returns "joy" classification

**Environment:** macOS 14, Chrome 120
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

- Use case and motivation
- Proposed solution
- Alternatives you've considered
- Additional context

### Pull Requests

1. **Fork** the repository
2. **Create your branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests** (`npm test`)
5. **Run linting** (`npm run lint`)
6. **Commit** your changes (use conventional commits)
7. **Push** to your branch
8. **Open a Pull Request**

## 🛠 Development Setup

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Inner-Compass.git
cd Inner-Compass

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

### Environment Variables

Required variables in `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📋 Code Standards

### TypeScript

- Use strict mode (enabled in tsconfig.json)
- Define explicit types for function parameters and returns
- Avoid `any` - use `unknown` if necessary
- Use interfaces for object shapes

### Component Structure

```tsx
'use client'

import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

export function Component({ title, children }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}
```

### API Routes

- Use the `createApiHandler` wrapper for consistency
- Include rate limiting
- Validate input
- Return structured responses

```typescript
import { createApiHandler } from '@/lib/api'

export const POST = createApiHandler(async (request) => {
  const body = await request.json()
  
  if (!body.text) {
    return {
      success: false,
      error: { message: 'Text is required' },
    }
  }
  
  // Process...
  
  return {
    success: true,
    data: { result: '...' },
  }
})
```

### Testing

Write tests for:

- Utility functions
- API route handlers
- Complex components
- Critical user flows

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

## 🎯 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(journal): add emotion visualization
fix(api): handle empty request body
docs(readme): update installation steps
test(auth): add login flow tests
```

## 📦 Release Process

1. Update `CHANGELOG.md` with changes
2. Bump version in `package.json`
3. Create git tag: `git tag v1.0.0`
4. Push tags: `git push origin --tags`
5. Create GitHub release with changelog

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Accept constructive criticism
- Focus on what's best for the community

## 📞 Need Help?

- Check existing [issues](https://github.com/Leonydis147/Inner-Compass/issues)
- Read the [documentation](./README.md)
- Contact: [Your contact info]

## 🙏 Thank You!

Every contribution makes Inner Compass better. Thank you for being part of our community!
