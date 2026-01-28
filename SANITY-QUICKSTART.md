# Sanity CMS - Quick Start Guide

**Get your blog running with Sanity CMS in 20 minutes** ⏱️

---

## ✅ What's Already Done

- [x] Sanity client configured
- [x] SEO-optimized schema created
- [x] Content renderer built
- [x] Blog pages connected
- [x] ISR performance enabled
- [x] Analytics integrated
- [x] Dependencies installed

**Status**: Code complete. Just needs Sanity credentials.

---

## 🚀 Setup (20 Minutes)

### Step 1: Create Sanity Project (5 min)

1. Go to **https://www.sanity.io/**
2. Click "Get Started" or "Sign Up"
3. Sign up with **GitHub** (fastest)
4. Click "Create New Project"
5. Name: **"Explain My IT Blog"**
6. Click "Create"
7. **Copy your Project ID** (8 characters, like `abc123de`)

### Step 2: Add Credentials (2 min)

Open `.env.local` and add:

```bash
# Sanity CMS (Blog Content Management)
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123de
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

Replace `abc123de` with your actual Project ID.

### Step 3: Restart Dev Server (1 min)

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Deploy Schema (5 min)

```bash
# Initialize Sanity CLI connection
npx sanity init

# Follow prompts:
# - Login (browser will open)
# - Select "Explain My IT Blog" project
# - Use existing configuration

# Deploy your schema
npx sanity schema deploy
```

### Step 5: Access Sanity Studio (2 min)

**Option A**: Via Sanity Cloud (Easiest)

1. Go to **https://www.sanity.io/manage**
2. Click your project: "Explain My IT Blog"
3. Click "Open Studio" or go to: `https://your-project.sanity.studio`

**Option B**: Run locally (Alternative)

```bash
npx sanity start
# Studio opens at: http://localhost:3333
```

### Step 6: Create First Post (5 min)

In Sanity Studio:

1. Click **"+ Create"** button (top left)
2. Select **"Blog Post"**
3. Fill in fields:
   - **Title**: "What Does 'The Cloud' Actually Mean?"
   - **Slug**: Click "Generate" button
   - **Excerpt**: "A plain-English explanation of cloud computing for business owners. No jargon, just clarity."
   - **Published Date**: Select today
   - **Body Content**: 
     ```
     ## What is the Cloud?
     
     The "cloud" is just someone else's computer that you can rent.
     
     Instead of buying your own server, you rent computing power from 
     companies like AWS, Microsoft, or Google. It's like renting an 
     apartment instead of buying a house.
     
     ### Why It Matters
     
     For business owners, cloud computing means:
     - **Lower upfront costs**: No hardware to buy
     - **Flexibility**: Scale up or down as needed  
     - **Accessibility**: Work from anywhere
     
     That's it. No magic, just practical technology rental.
     ```
4. **Optional - SEO Settings** (expand section):
   - Keywords: "cloud computing explained", "what is the cloud", "cloud for business"
5. Click **"Publish"** (top right)

### Step 7: Verify It Works (3 min)

1. Go to **http://localhost:3000/blog**
2. You should see your post!
3. Click on the post
4. Content should render beautifully
5. Right-click → "View Page Source"
6. Look for `<meta name="description">` (your excerpt)
7. Look for `<script type="application/ld+json">` (Article schema)

**If you see your post with proper formatting → Success!** ✅

---

## 🎓 Writing Your Next Post (30 min)

### Good Post Structure

```
Title: "5 IT Terms Business Owners Should Know"
↓
Introduction (2-3 sentences)
Hook the reader, explain what they'll learn
↓
## Main Section 1
First concept with explanation
↓
### Subsection (if needed)
More detail on specific point
↓
## Main Section 2
Second concept
↓
## Conclusion
Summary + CTA to Explain My IT
```

### SEO Checklist

- [ ] Title is 50-60 characters
- [ ] Title includes main keyword
- [ ] Excerpt is 150-160 characters
- [ ] Excerpt is compelling (makes them want to read)
- [ ] Content is 1,000+ words
- [ ] Uses H2 headings for main sections
- [ ] Uses H3 headings for subsections
- [ ] Includes 2-3 internal links
- [ ] First paragraph hooks the reader
- [ ] Conclusion summarizes key points

### Formatting Guide

**Headings**:
- Use **H2** for main sections (## in editor)
- Use **H3** for subsections (### in editor)
- H1 is automatically your title

**Emphasis**:
- **Bold** for key concepts (toolbar button)
- *Italic* for subtle emphasis
- `Code` for technical terms

**Lists**:
- Bullet lists for items
- Numbered lists for steps
- Keep items concise (1-2 lines)

**Links**:
- Highlight text → Click link button
- Paste URL
- Check "Open in new tab" for external links
- Keep internal links in same tab (default)

---

## 📊 Monitoring Your Blog

### Umami Analytics

Your blog posts are automatically tracked:

**Events**:
- `blog-post-read` - Someone opens a post
- `blog-post-completed` - They scroll 90%+ (engaged!)

**Check**:
1. Go to your Umami dashboard
2. Click "Events" tab
3. See which posts perform best

### Google Search Console (Week 2)

After you have 5-10 posts:

1. Go to **https://search.google.com/search-console**
2. Add property: "explainmyit.com"
3. Verify ownership (DNS method easiest)
4. Submit sitemap: `https://explainmyit.com/sitemap.xml`

**What you'll see**:
- Which posts rank in Google
- What people search to find you
- Click-through rates
- Ranking positions

---

## 🎯 Content Strategy (First Month)

### Week 1: Foundation (3 posts)

1. "What Does 'The Cloud' Actually Mean?"
2. "5 IT Terms Business Owners Should Understand"
3. "How to Know If Your IT Setup Is Risky"

**Goal**: Cover basics your customers ask about

### Week 2-4: Depth (1-2 posts/week)

4. "MSP vs In-House IT: Which Is Right for You?"
5. "IT Security Basics That Don't Require a Degree"
6. "What Good IT Documentation Looks Like"
7. "When to Upgrade Your IT Infrastructure"

**Goal**: Address decision-making questions

### Topics to Cover

**Evergreen content** (always relevant):
- IT terminology explained
- Security basics
- Buying decisions (MSP, cloud, etc.)
- Risk assessment
- Compliance basics (for your industry)

**Avoid**:
- News/trends (gets outdated)
- Product reviews (vendor-specific)
- Overly technical content (not your ICP)

---

## 🔧 Troubleshooting

### "Posts Not Showing on /blog"

**Check**:
1. Sanity Project ID in `.env.local` is correct
2. Dev server restarted after adding env vars
3. Posts are **published** (not drafts)
4. `publishedAt` date is in the **past**

**Fix**:
```bash
# Stop dev server (Ctrl+C)
# Start again
npm run dev
```

### "Can't Access Sanity Studio"

**Check**:
1. You're logged into Sanity.io
2. Project exists at https://www.sanity.io/manage
3. Using correct URL

**Fix**: Go to https://www.sanity.io/manage → Click project → "Open Studio"

### "Content Not Rendering"

**Check**:
1. Post has body content in Sanity Studio
2. Browser console for errors (F12)

**Fix**: Make sure Body Content field is filled in Sanity

### "SEO Tags Missing"

**Check**:
1. Right-click → View Page Source
2. Look in `<head>` section for `<meta>` tags

**Fix**: Tags generate automatically. If missing, post might not be loaded properly.

---

## 📚 Documentation

**Quick Reference** (this file):
- Setup steps
- First post guide

**Complete Guides**:
- `Docs/SANITY-SETUP-GUIDE.md` - Detailed setup (20 parts)
- `Docs/SANITY-SEO-GUIDE.md` - SEO strategy (10 parts)
- `Docs/SANITY-COMPLETE.md` - Full summary
- `SANITY-INTEGRATION.md` - Technical details

---

## 💰 Costs

**Free Tier Limits**:
- 3 users
- 100K API requests/month
- 10GB bandwidth/month
- Unlimited documents

**Your expected usage**:
- ~50 blog posts in year 1
- ~10K API requests/month (for 50K visitors)
- **Well within free tier** ✅

**When to upgrade**: After 500K+ visitors/month

---

## 🎉 Success!

**You now have**:
- ✅ Professional CMS for blog content
- ✅ SEO-optimized automatically
- ✅ Rich text editor
- ✅ Version history
- ✅ Fast performance (ISR)
- ✅ Analytics tracking
- ✅ Cost: $0/month

**Next**:
1. Write 3 posts this week
2. Share on social media
3. Submit to Google Search Console
4. Monitor analytics

---

## 🚀 Publishing Checklist

Before clicking "Publish":

- [ ] Title is clear and keyword-rich
- [ ] Slug is short and descriptive
- [ ] Excerpt is compelling (150-160 chars)
- [ ] Content is 1,000+ words
- [ ] H2 headings structure content
- [ ] 2-3 internal links added
- [ ] Formatted with bold/lists
- [ ] Proofread for typos
- [ ] CTA to Explain My IT at end

After publishing:

- [ ] Post appears on /blog
- [ ] Content renders properly
- [ ] Share on LinkedIn
- [ ] Monitor in Umami

---

**That's it! You're ready to publish SEO-optimized content.** 🎯

**Questions?** Check the detailed guides in `Docs/` folder.
