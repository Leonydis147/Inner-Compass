# Inner Compass - Complete Setup Guide

## ✅ Code Pushed to GitHub

Your repository is now live at: **https://github.com/Leonydis147/Inner-Compass**

---

## 🔑 Your Credentials

### Supabase
```
Publishable Key: [Your Supabase publishable key from dashboard]
Secret Key:      [Your Supabase service role key from dashboard]
```
**Note:** You provided these earlier - find them in your Supabase dashboard under Settings → API

### GitHub
```
Repo:  https://github.com/Leonydis147/Inner-Compass
```

### OpenAI
You'll need to create an API key at: https://platform.openai.com/api-keys

### Stripe (Not Yet Created)
You'll need to set up Stripe separately for subscription billing.

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up Supabase

1. **Go to Supabase Dashboard**
   - Your keys suggest you may already have a project
   - If not, create one at https://supabase.com/dashboard

2. **Run the Database Migration**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/migrations/001_initial.sql`
   - Paste and run

3. **Add Stripe Columns to user_profiles**
   ```sql
   ALTER TABLE user_profiles 
   ADD COLUMN stripe_subscription_id text,
   ADD COLUMN subscription_status text DEFAULT 'free',
   ADD COLUMN stripe_customer_id text;
   ```

4. **Get Your Supabase URLs**
   - Go to Settings → API
   - Copy:
     - Project URL: `https://xxxxx.supabase.co`
     - Anon/Public Key: `eyJ...`
     - Service Role Key: `eyJ...` (keep this secret!)

---

### Step 2: Deploy to Vercel

1. **Import Your Repository**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select `Leonydis147/Inner-Compass`
   - Click "Import"

2. **Configure Environment Variables**
   
   Add these in Vercel → Project Settings → Environment Variables:

   ```env
   # OpenAI (create at https://platform.openai.com/api-keys)
   OPENAI_API_KEY=sk-proj-...
   
   # Supabase (from your dashboard)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Supabase Public (for client-side)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   
   # Stripe (optional - create at https://dashboard.stripe.com/apikeys)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_BASIC_MONTHLY=price_...
   STRIPE_PRICE_PRO_MONTHLY=price_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   
   # App URL (update after deployment)
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app is live!

---

### Step 3: Set Up Stripe (Optional - For Premium Features)

If you want to enable subscription billing:

1. **Create Stripe Account**
   - Go to https://dashboard.stripe.com/register
   - Complete setup

2. **Create Products**
   - Go to https://dashboard.stripe.com/products
   - Click "Add product"
   
   **Basic Plan:**
   - Name: "Inner Compass Basic"
   - Price: $9.99 USD
   - Billing: Recurring (monthly)
   - Copy the Price ID (starts with `price_`)
   
   **Pro Plan:**
   - Name: "Inner Compass Pro"
   - Price: $19.99 USD
   - Billing: Recurring (monthly)
   - Copy the Price ID

3. **Set Up Webhooks**
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Click "Add endpoint"
   - Copy the **Signing Secret** (starts with `whsec_`)

4. **Update Vercel Environment Variables**
   - Add all Stripe keys to your Vercel project
   - Redeploy

---

### Step 4: Test Your App

1. **Visit Your Deployed App**
   - Go to `https://your-app.vercel.app`

2. **Test Journaling**
   - Write a journal entry
   - Click "Get Insight"
   - Wait for AI response

3. **Test Authentication**
   - Go to `/auth`
   - Sign up with email
   - Check email for confirmation

4. **Test Subscription (if Stripe configured)**
   - Go to `/pricing`
   - Click "Get Started" on a plan
   - Complete test checkout

---

## 🔧 Troubleshooting

### Build Fails on Vercel
```
Error: Missing environment variables
```
**Solution:** Add all required environment variables in Vercel dashboard

### API Returns 500 Error
```
Error: OpenAI API key not found
```
**Solution:** Ensure `OPENAI_API_KEY` is set in Vercel environment variables

### Database Connection Fails
```
Error: Invalid Supabase URL
```
**Solution:** Check that `SUPABASE_URL` has no trailing slash

### Stripe Checkout Fails
```
Error: No price found
```
**Solution:** Verify Stripe price IDs are correct in environment variables

---

## 📊 Cost Estimates

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth/mo | $20/mo (Pro) |
| **Supabase** | 500MB DB, 50K MAU | $25/mo (Pro) |
| **OpenAI** | Pay-as-you-go | ~$0.002/1K tokens |
| **Stripe** | 2.9% + $0.30 per transaction | Same |

**Estimated monthly cost for 1,000 users:** $50-150

---

## 📝 Next Steps

1. ✅ **Done:** Code pushed to GitHub
2. ⏳ **Next:** Deploy to Vercel
3. ⏳ **Then:** Configure Supabase database
4. ⏳ **Optional:** Set up Stripe for payments
5. ⏳ **Finally:** Test and launch!

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs
- **Stripe Docs:** https://stripe.com/docs

**Your app is ready to deploy!** 🎉
