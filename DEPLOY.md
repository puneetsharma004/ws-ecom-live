# Deploying WS CubeTech Store (production)

Stack: Next.js (App Router) on **Vercel** + **Supabase** + **Razorpay**.

## 1. Prerequisites
- A GitHub repo with this project pushed.
- A Vercel account, a Supabase project (already set up), a Razorpay account.
- All DB migrations applied in Supabase SQL editor, in order:
  `0001` → `0002` → `0003` → `0004` → `0005` → `0006`.

## 2. Push to GitHub
```bash
git add .
git commit -m "Production-ready store"
git push
```
> Make sure `.env.local` is NOT committed (it's gitignored). Double-check
> `.env.example` contains only blank placeholders — no real secrets.

## 3. Import to Vercel
1. Vercel → **New Project** → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Build command `next build`.
3. Add **Environment Variables** (Production + Preview). Copy keys from
   `.env.example`:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase API settings (**server only**) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret (**server only**) |
| `RAZORPAY_WEBHOOK_SECRET` | the signing secret you create in step 5 |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://store.wscubetech.com` |
| `NEXT_PUBLIC_COURSES_URL` | your courses platform URL |

4. Deploy.

## 4. Custom domain
Vercel → Project → **Domains** → add your domain and follow the DNS steps.
Update `NEXT_PUBLIC_SITE_URL` to match, then redeploy.

## 5. Razorpay webhook (required in production)
The webhook is the authoritative payment confirmation.
1. Razorpay Dashboard → **Settings → Webhooks → Add New Webhook**.
2. URL: `https://YOUR_DOMAIN/api/webhooks/razorpay`
3. Active events: **`payment.captured`** and **`order.paid`**.
4. Set a **Secret** (any strong random string) → put that exact value in the
   Vercel env var `RAZORPAY_WEBHOOK_SECRET`, then redeploy.
   (Right now `.env.local` has a URL there by mistake — it must be the secret string.)

## 6. Go live (real money)
- Complete Razorpay **KYC / activation**.
- Switch the test keys (`rzp_test_…`) to **live keys** (`rzp_live_…`) in Vercel:
  `NEXT_PUBLIC_RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`. Add a **live-mode**
  webhook with the same URL + a live signing secret.

## 7. Post-deploy checks
- Run `supabase/security-audit.sql` in Supabase → all tables RLS-enabled,
  `mark_order_paid` not executable by anon/authenticated.
- Do a full **test-mode** purchase end to end; confirm the order flips to `paid`
  and stock decrements (webhook + the synchronous verify both do this).
- Visit `/robots.txt` and `/sitemap.xml`.
- Lighthouse the **production** URL (not `next dev`).

## Notes
- Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`,
  `RAZORPAY_WEBHOOK_SECRET`) live only in server env — never prefixed
  `NEXT_PUBLIC_`, never imported into client components.
- The in-memory rate limiter (`src/lib/rate-limit.js`) is per-instance. For
  strict distributed limits later, swap in Upstash Redis.
- Treat the test keys currently in `.env.local` as compromised once shared —
  rotate them in Razorpay before going live if needed.
