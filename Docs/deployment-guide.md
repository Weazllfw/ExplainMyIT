# Deployment Guide - Explain My IT

## Pre-Deployment Checklist

Before deploying to Vercel, complete these steps:

### 1. Brevo Setup

1. **Create Brevo account**: https://app.brevo.com/account/register
2. **Verify sender email/domain**:
   - Go to Senders & IP
   - Add and verify your email domain
3. **Create contact list**:
   - Go to Contacts > Lists
   - Create new list: "Early Access Waitlist"
   - Note the List ID (you'll need this)
4. **Get API key**:
   - Go to Settings > API Keys
   - Create new API key
   - Copy and save securely
5. **Update list ID in code**:
   - Open `lib/brevo.ts`
   - Line 23: Change `listIds: [2]` to your actual list ID

### 2. Umami Setup

**Option A: Self-Hosted**
1. Follow Umami installation guide: https://umami.is/docs/install
2. Deploy to your hosting provider (Vercel, Railway, etc.)
3. Create a new website in Umami dashboard
4. Get the website ID and script URL

**Option B: Umami Cloud**
1. Sign up at https://cloud.umami.is/
2. Create a new website
3. Get the website ID and script URL

**Note the following:**
- Website ID (UUID format)
- Script URL (e.g., `https://your-umami.vercel.app/script.js`)

### 3. Domain Setup

Before deploying:
1. Ensure you own the domain `explainmyit.com`
2. Have access to DNS settings
3. Decide on www vs non-www (recommend non-www)

### 4. Content Assets

Replace placeholder files:
- `public/logo.png` - Company logo (200x60px recommended)
- `app/favicon.ico` - Favicon (32x32px)
- Optional: Open Graph image for social sharing

### 5. Update Contact Email

Search and replace `contact@explainmyit.com` with your actual email in:
- `app/layout.tsx` (structured data)
- `components/Footer.tsx`
- `app/privacy/page.tsx`

## Vercel Deployment

### Initial Setup

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Explain My IT v1"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   
   In Vercel project settings (Settings > Environment Variables), add:

   ```
   BREVO_API_KEY=your_actual_brevo_api_key
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_website_id
   NEXT_PUBLIC_UMAMI_SRC=https://your-umami-instance.com/script.js
   ```

   **Important**: 
   - Make sure to add these for Production, Preview, and Development environments
   - Never commit these values to Git

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Note your deployment URL (e.g., `explainmyit.vercel.app`)

### Custom Domain Setup

1. **Add domain in Vercel**:
   - Go to Project Settings > Domains
   - Add `explainmyit.com`
   - Vercel will provide DNS instructions

2. **Configure DNS**:
   - Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Add DNS records as instructed by Vercel:
     - A record pointing to Vercel's IP (76.76.21.21)
     - Or CNAME record pointing to `cname.vercel-dns.com`

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - Wait 5-10 minutes after DNS propagation

4. **Set up redirects**:
   - In Vercel, set `explainmyit.com` as primary domain
   - Enable automatic www redirect (if using non-www)

## Post-Deployment

### 1. Verify Site Functionality

Test the following:

- [ ] Homepage loads correctly
- [ ] All sections display properly on mobile and desktop
- [ ] Navigation links work (Home, Blog, Privacy)
- [ ] Blog index shows all 3 posts
- [ ] Individual blog posts load and render correctly
- [ ] Privacy policy page loads
- [ ] Footer links work

### 2. Test Waitlist Form

- [ ] Fill out the form with a test email
- [ ] Submit the form
- [ ] Verify success message appears
- [ ] Check Brevo dashboard to confirm contact was added
- [ ] Check if you received a confirmation email (if configured in Brevo)

### 3. Verify Analytics

- [ ] Visit your site
- [ ] Navigate to a few pages
- [ ] Check Umami dashboard (wait 1-2 minutes)
- [ ] Confirm page views are being tracked

### 4. SEO Setup

**Google Search Console:**

1. Go to https://search.google.com/search-console
2. Add property: `explainmyit.com`
3. Verify ownership (use DNS verification)
4. Submit sitemap: `https://explainmyit.com/sitemap.xml`

**Verify sitemap:**
- Visit https://explainmyit.com/sitemap.xml
- Should show all pages (home, blog, posts, privacy)

**Verify robots.txt:**
- Visit https://explainmyit.com/robots.txt
- Should show "Allow: /" and sitemap URL

### 5. Performance Check

Run Lighthouse audit:
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Run audit for mobile and desktop
4. Target: 90+ score on all metrics

**If scores are low:**
- Ensure Umami script uses `defer` attribute
- Check image sizes (if you added custom images)
- Verify no heavy third-party scripts

### 6. Cross-Browser Testing

Test on:
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge

### 7. Accessibility Check

- [ ] Test form with keyboard only (Tab navigation)
- [ ] Test with screen reader (NVDA or macOS VoiceOver)
- [ ] Verify color contrast is adequate
- [ ] Check all interactive elements have focus states

## Monitoring

### What to Track (Umami)

Key metrics to monitor:
- Page views on homepage
- Blog page visits
- Individual post popularity
- Waitlist form submissions (track as custom event)

### Waitlist Growth (Brevo)

Monitor in Brevo dashboard:
- Total contacts in "Early Access Waitlist"
- Growth rate
- Open rates (if sending emails)

## Troubleshooting

### Waitlist form not working

1. Check browser console for errors
2. Verify `BREVO_API_KEY` is set in Vercel
3. Check Brevo API key has correct permissions
4. Verify list ID in `lib/brevo.ts` matches your Brevo list

### Analytics not tracking

1. Verify `NEXT_PUBLIC_UMAMI_*` variables are set
2. Check browser console for script loading errors
3. Verify Umami instance is running (if self-hosted)
4. Check website ID is correct

### Blog posts not showing

1. Verify `.mdx` files are in `content/blog/` directory
2. Check frontmatter format is correct
3. Rebuild and redeploy

### Build fails on Vercel

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check for TypeScript errors

## Updating Content

### Adding new blog posts

1. Create new `.mdx` file in `content/blog/`
2. Add frontmatter (title, date, excerpt)
3. Write content
4. Commit and push to GitHub
5. Vercel auto-deploys

### Updating existing pages

1. Edit files in `app/` directory
2. Test locally: `npm run dev`
3. Commit and push
4. Vercel auto-deploys

## Security Best Practices

- [ ] Never commit `.env.local` to Git (already in `.gitignore`)
- [ ] Rotate API keys if exposed
- [ ] Use strong passwords for all services
- [ ] Enable 2FA on Vercel, GitHub, Brevo
- [ ] Regularly review Brevo contact list for spam addresses
- [ ] Monitor Vercel usage to catch unexpected traffic spikes

## Future: Adding Supabase (v2)

When ready to add authentication:

1. Create Supabase project: https://supabase.com
2. Get project URL and anon key
3. Add to Vercel environment variables
4. Build login/signup UI
5. Update implementation plan

**Do not build auth UI in v1** - it's out of scope.

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Brevo API Docs**: https://developers.brevo.com/
- **Umami Docs**: https://umami.is/docs

## Launch Checklist

Final checks before announcing:

- [ ] All environment variables configured
- [ ] Custom domain working with SSL
- [ ] Waitlist form tested and working
- [ ] Analytics tracking verified
- [ ] Sitemap submitted to Google Search Console
- [ ] All placeholder content replaced (logo, contact email)
- [ ] Cross-browser testing complete
- [ ] Mobile responsiveness verified
- [ ] Privacy policy reviewed and accurate
- [ ] All links tested
- [ ] Lighthouse score >90
- [ ] Test email sent through Brevo
- [ ] Backup of all API keys stored securely

**Once checklist is complete, you're ready to launch!**

## Post-Launch

1. Announce to your network
2. Monitor analytics daily for first week
3. Check waitlist growth
4. Respond to any contact emails promptly
5. Plan v2 features based on feedback

---

**Questions?** Refer to the Implementation Plan (`Docs/implementation-plan.md`) for detailed technical information.
