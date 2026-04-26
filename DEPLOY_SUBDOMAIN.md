# Deploy `moth` to a subdomain

This project can be deployed so `moth.yourdomain.com` opens the widget directly.

## 1) Push to GitHub

From this project root:

```bash
git add .
git commit -m "prepare moth subdomain deployment"
git push
```

## 2) Import into Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import this repo
3. Keep framework = **Next.js**

## 3) Configure environment variables

In Vercel project settings, add:

- `ANTHROPIC_API_KEY` = your real key
- `ANTHROPIC_MODEL` = `claude-haiku-4-5-20251001` (recommended for speed/cost)

## 4) Add subdomain

In Vercel project settings -> Domains:

- Add: `moth.yourdomain.com`

Vercel will show the exact DNS target. Usually:

- Type: `CNAME`
- Name/Host: `moth`
- Value/Target: `cname.vercel-dns.com` (or the value Vercel shows)

## 5) Wait for DNS + SSL

Vercel will automatically issue HTTPS certs when DNS propagates.

## 6) Verify

- `https://moth.yourdomain.com` should redirect to `/moth` automatically.
- `https://moth.yourdomain.com/moth` should also work.

## Notes

- This repo includes middleware that redirects root (`/`) to `/moth` **only** on hosts starting with `moth.`.
- Keep your API key server-side only (Vercel env vars). Never hardcode it into `moth.html`.
