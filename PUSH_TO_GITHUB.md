# Push to GitHub - Quick Guide

Your Inner Compass app is ready! Follow these steps to push to your GitHub repository.

## Option 1: Using GitHub CLI (Recommended)

```bash
cd /mnt/data/openclaw/workspace/.openclaw/workspace/inner-compass

# Install GitHub CLI if not already installed
# On Linux: sudo apt install gh
# On macOS: brew install gh

# Authenticate
gh auth login

# Push to your repository
git remote set-url origin https://github.com/Leonydis147/Inner-Compass.git
git push -u origin main
```

## Option 2: Using Personal Access Token

1. **Create a Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control of private repositories)
   - Generate and copy the token

2. **Push using the token:**
```bash
cd /mnt/data/openclaw/workspace/.openclaw/workspace/inner-compass

# Replace YOUR_TOKEN with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/Leonydis147/Inner-Compass.git
git push -u origin main
```

## Option 3: Manual Push Through Browser

If you prefer not to use command line:

1. Go to https://github.com/Leonydis147/Inner-Compass
2. Click "uploading an existing file"
3. Drag and drop all files from `/mnt/data/openclaw/workspace/.openclaw/workspace/inner-compass/`
4. Commit changes

**Note:** This won't preserve git history but works for initial upload.

## After Pushing to GitHub

### Deploy to Vercel:

1. Go to https://vercel.com/new
2. Import your GitHub repository: `Leonydis147/Inner-Compass`
3. Configure environment variables (see below)
4. Click Deploy

### Environment Variables for Vercel:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `SUPABASE_URL` | https://xxxxx.supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `STRIPE_SECRET_KEY` | sk_test_... or sk_live_... |
| `STRIPE_PUBLISHABLE_KEY` | pk_test_... or pk_live_... |
| `STRIPE_WEBHOOK_SECRET` | whsec_... (from Stripe CLI or dashboard) |
| `STRIPE_PRICE_BASIC_MONTHLY` | price_xxx (from Stripe) |
| `STRIPE_PRICE_PRO_MONTHLY` | price_xxx (from Stripe) |
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_... or pk_live_... |
| `NEXT_PUBLIC_APP_URL` | https://your-app.vercel.app |

## Stripe Setup

1. **Create Products & Prices:**
   - Go to https://dashboard.stripe.com/products
   - Create "Basic Plan" - $9.99/month
   - Create "Pro Plan" - $19.99/month
   - Copy the price IDs (price_xxx) to environment variables

2. **Set Up Webhooks:**
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy the webhook secret (whsec_xxx) to environment variables

3. **Test Locally with Stripe CLI:**
```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Linux: curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Supabase Setup

1. Create project at https://supabase.com
2. Run the migration: `supabase/migrations/001_initial.sql`
3. Add `stripe_subscription_id` and `subscription_status` columns to `user_profiles` table:

```sql
ALTER TABLE user_profiles 
ADD COLUMN stripe_subscription_id text,
ADD COLUMN subscription_status text DEFAULT 'free',
ADD COLUMN stripe_customer_id text;
```

## You're Ready! 🚀

Once everything is set up:
- Users can sign up and journal
- Premium features are gated behind subscription
- Stripe handles all payments
- Webhooks update subscription status automatically
