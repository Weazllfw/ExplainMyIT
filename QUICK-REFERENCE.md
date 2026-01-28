# Quick Reference Card - Explain My IT

## 🚀 Essential Commands

```bash
# Start development server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Install dependencies
npm install
```

## 🌐 Local URLs

- **Homepage**: http://localhost:3000
- **Blog**: http://localhost:3000/blog
- **Privacy**: http://localhost:3000/privacy
- **Sitemap**: http://localhost:3000/sitemap.xml

## ⚙️ Configuration To-Do

### 1. Set up Brevo (Email)
- Sign up: https://app.brevo.com
- Get API key from Settings > API Keys
- Create a contact list, note the list ID
- Add to `.env.local`: `BREVO_API_KEY=xxx`
- Update `lib/brevo.ts` line 23 with your list ID

### 2. Set up Umami (Analytics)
- Option A: https://cloud.umami.is/ (easiest)
- Option B: Self-host (see Umami docs)
- Get website ID and script URL
- Add to `.env.local`:
  - `NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxx`
  - `NEXT_PUBLIC_UMAMI_SRC=https://your-instance/script.js`

### 3. Replace Placeholders
- Contact email: Search `contact@explainmyit.com` and replace
- Logo: Replace `public/logo.png`
- Favicon: Add `app/favicon.ico` (32x32px)

## 📝 Add Blog Posts

Create `content/blog/your-slug.mdx`:

```mdx
---
title: "Your Title"
date: "2026-01-28"
excerpt: "Brief description"
---

Your content here...
```

Save and restart dev server.

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import to Vercel: https://vercel.com/new
3. Add environment variables in Vercel settings
4. Deploy
5. Add custom domain

See `Docs/deployment-guide.md` for details.

## 📂 Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage |
| `app/blog/page.tsx` | Blog index |
| `app/blog/[slug]/page.tsx` | Blog posts |
| `components/WaitlistForm.tsx` | Email signup |
| `lib/brevo.ts` | Email integration |
| `lib/blog.ts` | Blog utilities |
| `.env.local` | Environment variables |

## 🐛 Troubleshooting

### Form doesn't work
→ Check `.env.local` has `BREVO_API_KEY`
→ Verify list ID in `lib/brevo.ts`

### Analytics not tracking
→ Check Umami env vars are set
→ Wait 1-2 minutes for data

### Build fails
→ Run `npm run build` to see errors
→ Check TypeScript errors

## 📚 Full Documentation

- **Getting Started**: `GETTING-STARTED.md`
- **Implementation Plan**: `Docs/implementation-plan.md`
- **Deployment Guide**: `Docs/deployment-guide.md`
- **Completion Summary**: `Docs/COMPLETION-SUMMARY.md`

## ✅ Pre-Launch Checklist

- [ ] Configure Brevo + update list ID
- [ ] Configure Umami
- [ ] Update `.env.local`
- [ ] Replace contact email (3 files)
- [ ] Add logo and favicon
- [ ] Test waitlist form
- [ ] Test on mobile
- [ ] Run `npm run build` (should succeed)
- [ ] Deploy to Vercel
- [ ] Add custom domain
- [ ] Submit sitemap to Google Search Console

## 🆘 Help

- Next.js docs: https://nextjs.org/docs
- Brevo docs: https://developers.brevo.com/
- Umami docs: https://umami.is/docs
- Vercel docs: https://vercel.com/docs

---

**The site is running at http://localhost:3000** 🎉
