## Sanity CMS - Complete Setup Guide

**Status**: Code Ready - Needs Configuration  
**SEO**: Fully Optimized  
**Content Management**: Professional Headless CMS

---

## Overview

Sanity is a powerful, API-first headless CMS that gives you professional content management with:
- ✅ Real-time editing experience
- ✅ Structured content (perfect for SEO)
- ✅ Flexible content modeling
- ✅ Image optimization built-in
- ✅ Version history
- ✅ Collaborative editing
- ✅ GraphQL & GROQ query support
- ✅ Free tier (generous limits)

---

## Part 1: Create Sanity Project (10 minutes)

### Step 1: Sign Up for Sanity

1. Go to https://www.sanity.io/
2. Click "Get Started" or "Sign Up"
3. Sign up with:
   - GitHub (recommended - faster)
   - Google
   - Email

### Step 2: Create New Project

**Option A: Using Sanity CLI** (Recommended)

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Initialize project in a separate directory (we'll use the schema)
sanity init

# Follow prompts:
# - Create new project: Yes
# - Project name: "Explain My IT Blog"
# - Dataset: "production"
# - Output path: ./sanity-studio (or any folder)
```

**Option B: Using Sanity Dashboard** (Easier)

1. Go to https://www.sanity.io/manage
2. Click "Create Project"
3. Name: "Explain My IT Blog"
4. Click "Create"
5. Note your **Project ID** (8 characters, e.g., `abc123de`)

---

## Part 2: Get Your Credentials (2 minutes)

### Get Project ID

**From Dashboard**:
1. Go to https://www.sanity.io/manage
2. Click on your project
3. Settings > Project Details
4. Copy **Project ID**

**From CLI**:
```bash
sanity projects list
# Shows: Project ID | Name
```

### Get API Token (Optional for Public Reading)

1. Go to https://www.sanity.io/manage
2. Click your project
3. API > Tokens
4. Add API Token:
   - Name: "Next.js Website"
   - Permissions: **Viewer** (read-only) or **Editor** (if you need write access from Next.js)
5. Copy token (shown once!)

### Create Dataset

If not created during initialization:
1. Go to https://www.sanity.io/manage
2. Your project > Datasets
3. Click "Add dataset"
4. Name: "production"
5. Visibility: "Public" (for reading without auth)

---

## Part 3: Configure Environment Variables (2 minutes)

Update your `.env.local`:

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123de
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here_if_needed
```

**Notes**:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your 8-character project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Usually "production"
- `SANITY_API_TOKEN`: Only needed if dataset is private or for write operations

---

## Part 4: Install Dependencies (3 minutes)

```bash
# Install Sanity packages
npm install

# If you get errors, try:
npm install @sanity/client @portabletext/react next-sanity
```

---

## Part 5: Deploy Sanity Schema (5 minutes)

### Option A: Using Sanity CLI (Recommended)

```bash
# From your project root (d:\Projects\ExplainMyIT)
npx sanity init --project abc123de --dataset production

# This creates a sanity.config.ts if needed
# Then deploy the schema:
npx sanity schema deploy
```

### Option B: Using Sanity Studio

Sanity Studio is a web-based content editor that you can host:

**Quick Deploy to Sanity Cloud** (Easiest):

1. Create `sanity.cli.ts` in project root:

```typescript
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'abc123de',
    dataset: 'production'
  }
});
```

2. Deploy schema:

```bash
npx sanity schema deploy
```

---

## Part 6: Access Sanity Studio (2 Options)

### Option A: Embedded Studio (In Your Next.js App)

**Pros**: One deployment, all in one place  
**Cons**: Adds to bundle size

1. Studio will be available at: `http://localhost:3000/studio` (when implemented)

### Option B: Separate Studio Deployment (Recommended)

**Pros**: Cleaner separation, faster Next.js builds  
**Cons**: Separate deployment

```bash
# Create new Sanity Studio project
npx create-sanity@latest

# Options:
# - Project: Select "Explain My IT Blog"
# - Dataset: production
# - Output: ./sanity-studio (separate folder)
# - Schema: blank

# Copy your schema from this project:
# Copy: d:\Projects\ExplainMyIT\sanity\schemas\* 
# To: ./sanity-studio/schemas/

# Deploy Studio:
cd sanity-studio
npm run deploy

# Studio will be at: https://your-project.sanity.studio
```

---

## Part 7: Create Your First Blog Post (5 minutes)

### Access Studio

**If using separate deployment**:
- Go to https://your-project.sanity.studio

**If using embedded** (future):
- Go to http://localhost:3000/studio

### Create Post

1. Click "+ Create" button
2. Select "Blog Post"
3. Fill in fields:
   - **Title**: "What Does 'The Cloud' Actually Mean?"
   - **Slug**: Click "Generate" (creates URL-friendly version)
   - **Excerpt**: "A plain-English explanation of cloud computing for business owners."
   - **Published Date**: Set to today
   - **Body Content**: Write your post using the rich text editor
     - Use headings (H2, H3) for structure
     - Add lists for readability
     - Link to relevant resources
   - **SEO Settings** (optional but recommended):
     - Meta Title: Can override title
     - Meta Description: Can override excerpt
     - Keywords: Add 3-5 relevant keywords

4. Click "Publish" (top right)

---

## Part 8: Verify Integration (3 minutes)

### Test Locally

```bash
# Restart dev server to pick up env vars
npm run dev

# Visit: http://localhost:3000/blog
# You should see your post!

# Click on the post
# Content should render beautifully
```

### Check SEO

1. View page source (Ctrl+U)
2. Look for:
   - `<title>` tag with your post title
   - `<meta name="description">` with excerpt
   - JSON-LD structured data (`<script type="application/ld+json">`)
   - Open Graph tags (`<meta property="og:...">`)

---

## Part 9: SEO Features Explained

### What's Automatically Optimized

#### 1. Metadata
- `<title>` tag: Post title or custom meta title
- `<meta name="description">`: Excerpt or custom meta description
- `<meta name="keywords">`: From SEO settings
- `<meta name="robots">`: Respects noIndex setting

#### 2. Open Graph (Social Sharing)
- `og:type`: "article"
- `og:title`: Post title
- `og:description`: Excerpt
- `og:published_time`: Publication date

#### 3. Twitter Cards
- `twitter:card`: "summary_large_image"
- `twitter:title`: Post title
- `twitter:description`: Excerpt

#### 4. Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Post Title",
  "datePublished": "2024-01-28",
  "author": {
    "@type": "Organization",
    "name": "Explain My IT"
  },
  "publisher": { ... },
  "description": "Your excerpt"
}
```

#### 5. Semantic HTML
- Proper `<article>` tags
- `<time>` tags with datetime attributes
- Heading hierarchy (H1 → H2 → H3)

#### 6. Performance
- **ISR (Incremental Static Regeneration)**: Pages revalidate every hour
- **Static Generation**: Blog pages pre-built at build time
- **CDN Caching**: Sanity CDN for fast content delivery

---

## Part 10: Content Best Practices (SEO)

### Writing SEO-Friendly Posts

#### 1. Title Optimization
- **Length**: 50-60 characters (shows fully in search results)
- **Front-load keywords**: Important words first
- **Be specific**: "What is Cloud Computing?" not "Computing Stuff"
- **Example**: "What Does 'The Cloud' Actually Mean? | Plain English"

#### 2. Excerpt/Meta Description
- **Length**: 150-160 characters
- **Include target keyword**: "cloud computing", "IT for business owners"
- **Compelling**: Make people want to click
- **Example**: "A plain-English explanation of cloud computing that business owners can actually understand. No jargon, just clarity."

#### 3. URL Slug
- **Keep short**: 3-5 words max
- **Use hyphens**: "what-is-cloud-computing"
- **Avoid**: dates, categories, unnecessary words
- **Example**: `/blog/what-is-cloud` (good) vs `/blog/2024/01/28/what-is-cloud-computing-explained` (bad)

#### 4. Content Structure
```markdown
# Post Title (H1) - automatic

## Main Section (H2)
Content paragraph...

### Subsection (H3)
More specific content...

- Bullet points for scannability
- Keep paragraphs short (2-3 sentences)
- Use bold for **key concepts**
```

#### 5. Internal Linking
Link to other blog posts and your homepage:
- "Learn more about [IT terminology](/blog/it-terms-explained)"
- "Get clarity with [Explain My IT](/)

#### 6. Keywords
Target 3-5 focus keywords per post:
- Primary: "cloud computing explained"
- Secondary: "what is the cloud", "cloud for business owners"
- Related: "IT infrastructure", "business technology"

---

## Part 11: Production Deployment

### Add to Vercel

1. Go to Vercel project settings
2. Environment Variables
3. Add Sanity variables:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123de
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=sk-xxx (if needed)
   ```
4. Redeploy

### Verify Production

1. Go to https://explainmyit.com/blog
2. Check posts load
3. View page source, verify SEO tags
4. Test sharing on social media (Open Graph)

---

## Part 12: Content Workflow

### Daily Publishing Workflow

1. **Write in Sanity Studio**
   - Draft posts
   - Review/edit
   - Set publish date

2. **Publish**
   - Click "Publish" in Studio
   - Content is immediately available (via CDN)

3. **Site Updates** (Automatic)
   - ISR revalidates every hour
   - New post appears within 1 hour
   - Or trigger rebuild in Vercel for instant update

### Updating Existing Posts

1. Edit in Sanity Studio
2. Save changes
3. Site updates within 1 hour (ISR)

### Instant Updates (Optional)

Set up Sanity webhook to trigger revalidation:
1. Sanity > Project Settings > Webhooks
2. Add webhook:
   - URL: `https://explainmyit.com/api/revalidate`
   - Trigger: On publish
3. This triggers instant ISR revalidation

---

## Part 13: Advanced Features

### Content Scheduling

**Built into Sanity**:
1. Set "Published Date" to future date
2. Post won't appear until that date

**Or use a filter**:
```typescript
// In sanity/client.ts, update query:
*[_type == "post" && publishedAt <= now()] | order(publishedAt desc)
```

### Draft Mode / Preview

See unpublished content before it goes live:
1. Enable Preview Mode in Next.js
2. View draft posts
3. Approve and publish

(Implementation guide in separate doc if needed)

### Rich Media

**Images** (future):
1. Add image field to schema
2. Use Sanity Image URLs (auto-optimized)
3. CDN delivery

**Videos** (future):
1. Upload to Sanity or embed YouTube
2. Responsive video player

---

## Part 14: Sanity Studio Customization

### Custom Fields (If Needed Later)

Add to `sanity/schemas/post.ts`:

```typescript
defineField({
  name: 'featuredImage',
  title: 'Featured Image',
  type: 'image',
  options: {
    hotspot: true // For cropping
  },
  description: 'Main image for the post (1200x630px for social sharing)'
}),
```

### Categories/Tags (If Needed)

```typescript
defineField({
  name: 'categories',
  title: 'Categories',
  type: 'array',
  of: [{ type: 'string' }],
  options: {
    list: [
      { title: 'Cloud', value: 'cloud' },
      { title: 'Security', value: 'security' },
      { title: 'Infrastructure', value: 'infrastructure' }
    ]
  }
}),
```

---

## Part 15: Monitoring & Optimization

### Check Content Performance

**In Umami (Analytics)**:
1. Blog post reads
2. Completion rates
3. Which posts drive signups

**In Google Search Console**:
1. Which posts rank
2. Click-through rates
3. Search queries

### Optimize Based on Data

**High traffic, low engagement**:
- Update content
- Improve readability
- Add internal links

**Low traffic, high engagement**:
- Improve SEO (title, meta description)
- Build backlinks
- Share on social media

---

## Part 16: Troubleshooting

### Posts Not Showing

**Check**:
1. Sanity dataset is "production"
2. Posts are published (not drafts)
3. `publishedAt` date is in the past
4. Environment variables are correct

**Fix**:
```bash
# Verify connection
npx sanity debug --secrets

# Check posts exist
# Go to Sanity Studio, verify posts are published
```

### SEO Tags Missing

**Check**:
1. View page source
2. Look for `<meta>` tags
3. Look for JSON-LD script

**Fix**: Metadata is generated automatically from post data

### Slow Updates

**Normal**: ISR revalidates every 1 hour  
**Speed up**: Set up Sanity webhook for instant updates

---

## Part 17: Costs & Limits

### Sanity Pricing (2026)

**Free Tier** (Perfect for you):
- 3 users
- 10GB bandwidth/month
- 5GB assets
- 100K API requests/month
- Unlimited documents

**Expected usage** (first year):
- ~50 blog posts = minimal storage
- ~50K page views/month = ~10K API requests
- **Easily within free tier**

**When to upgrade**: After ~500K pageviews/month

---

## Part 18: Migration from MDX (Optional)

If you want to keep old MDX posts working alongside Sanity:

1. Keep both `lib/blog.ts` and `lib/sanity-blog.ts`
2. Create a merged function that checks both sources
3. Gradually migrate content to Sanity

**Or** (recommended): Migrate all at once
1. Copy MDX content into Sanity
2. Delete `content/blog/` folder
3. Remove `gray-matter` dependency

---

## Part 19: Quick Reference

### Key URLs

- **Sanity Dashboard**: https://www.sanity.io/manage
- **Your Studio**: https://your-project.sanity.studio
- **Sanity Docs**: https://www.sanity.io/docs

### Key Commands

```bash
# Deploy schema changes
npx sanity schema deploy

# Open Studio locally (if embedded)
npm run sanity

# Deploy Studio (if separate)
cd sanity-studio && npm run deploy

# Check Sanity status
npx sanity debug
```

### Key Files

- `sanity.config.ts` - Sanity project config
- `sanity/client.ts` - API client & queries
- `sanity/schemas/post.ts` - Blog post schema
- `lib/sanity-blog.ts` - Blog data fetching
- `components/PortableTextRenderer.tsx` - Content renderer

---

## Part 20: Success Checklist

### Setup Complete When:

- [ ] Sanity project created
- [ ] Environment variables added
- [ ] Dependencies installed
- [ ] Schema deployed
- [ ] Sanity Studio accessible
- [ ] First blog post published
- [ ] Post appears on /blog
- [ ] Post content renders properly
- [ ] SEO tags verified (view source)
- [ ] Umami tracking works
- [ ] Production env vars added to Vercel

---

## 🎉 You're Done!

**What you now have**:
- ✅ Professional CMS
- ✅ SEO-optimized blog
- ✅ Rich content editor
- ✅ Version history
- ✅ Real-time collaboration
- ✅ ISR for performance
- ✅ Free tier (generous limits)

**Next**: Create amazing content and watch your traffic grow! 📈

---

## Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **GROQ Query Language**: https://www.sanity.io/docs/groq
- **Portable Text**: https://github.com/portabletext/portabletext
- **Next.js + Sanity Guide**: https://www.sanity.io/guides/nextjs

---

**Need help?** Check the Sanity Community Slack or documentation.
