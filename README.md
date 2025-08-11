# Survey MVP (Next.js + Prisma + PostgreSQL)

A minimal survey-earning site with:
- Email-only login (MVP)
- Offerwall embed via `OFFERWALL_BASE_URL`
- Webhook endpoint to credit points
- Wallet ledger & withdrawal requests

> ⚠️ Production security (real email verification, anti-fraud, provider-specific HMAC verification, rate limiting, etc.) is **not** included. Add before launching publicly.

## 1) Prerequisites
- Node 18+
- PostgreSQL (use Supabase or Neon)
- `DATABASE_URL` in `.env`

## 2) Setup
```bash
cp .env.example .env
# fill DATABASE_URL, JWT_SECRET, SITE_URL, OFFERWALL_BASE_URL

npm install
npx prisma migrate dev --name init
npm run dev
```

Visit http://localhost:3000

## 3) Configure Offerwall
- Ask your provider for your wall URL. Set it in `.env` as `OFFERWALL_BASE_URL`.
- In provider dashboard, set your postback to: 
  - `https://YOUR_DOMAIN.com/api/webhooks/offerwall`
- Ensure it passes: `uid` (your user id), `amount` (points), `tx_id` (transaction id).
- If provider supports HMAC signature, set `OFFERWALL_HMAC_SECRET` and adjust signing scheme if needed.

## 4) Deploy (Vercel recommended)
1. Push this project to GitHub.
2. Import to Vercel → add env vars from `.env` (do not commit secrets).
3. Add your domain to Vercel. In your domain registrar set A/ALIAS/CNAME per Vercel instructions.

## 5) Admin Payouts
This MVP records withdrawals as `pending`. Pay them manually (e.g., PayPal), then mark as approved in DB:
```sql
update "Withdrawal" set status='approved' where id='WITHDRAWAL_ID';
```
Or add a small admin UI later.

## 6) Points Conversion
Default display uses **100 pts = $1**. Change in UI if needed.

## 7) US-only Notes
Add IP geofencing, phone/SMS verification, and VPN/proxy detection before public launch.
