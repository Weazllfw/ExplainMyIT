# Sanity SEO Strategy Guide

**Comprehensive SEO implementation for Sanity blog**

---

## Overview

Your Sanity integration is **fully optimized for SEO** from the ground up. This guide explains every SEO feature and how to use it effectively.

---

## Part 1: Technical SEO (Automatic)

### 1.1 HTML Meta Tags

**Every blog post automatically generates**:

```html
<!-- Primary Meta Tags -->
<title>Post Title | Explain My IT</title>
<meta name="title" content="Post Title">
<meta name="description" content="Post excerpt (150-160 chars)">
<meta name="keywords" content="keyword1, keyword2, keyword3">
<meta name="robots" content="index, follow">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="article">
<meta property="og:url" content="https://explainmyit.com/blog/slug">
<meta property="og:title" content="Post Title">
<meta property="og:description" content="Post excerpt">
<meta property="og:published_time" content="2024-01-28T12:00:00Z">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://explainmyit.com/blog/slug">
<meta property="twitter:title" content="Post Title">
<meta property="twitter:description" content="Post excerpt">
```

### 1.2 Structured Data (JSON-LD)

**Article Schema** (Google Rich Results):

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Post Title",
  "datePublished": "2024-01-28T12:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "Explain My IT"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Explain My IT",
    "logo": {
      "@type": "ImageObject",
      "url": "https://explainmyit.com/logo.png"
    }
  },
  "description": "Post excerpt",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://explainmyit.com/blog/slug"
  }
}
```

**Benefits**:
- ✅ Rich snippets in Google
- ✅ Better click-through rates
- ✅ Knowledge Graph eligibility
- ✅ Voice search optimization

### 1.3 Semantic HTML

```html
<article>
  <header>
    <h1>Post Title</h1>
    <time datetime="2024-01-28T12:00:00Z">January 28, 2024</time>
    <span>5 min read</span>
  </header>
  
  <div>
    <h2>Main Section</h2>
    <p>Content...</p>
    
    <h3>Subsection</h3>
    <p>More content...</p>
  </div>
</article>
```

**Benefits**:
- ✅ Search engines understand structure
- ✅ Screen reader friendly
- ✅ Accessibility score boost
- ✅ Better indexing

### 1.4 URL Structure

**Format**: `https://explainmyit.com/blog/[slug]`

**Best Practices** (enforced):
- ✅ Short slugs (3-5 words)
- ✅ Hyphen-separated
- ✅ Lowercase only
- ✅ No dates/categories
- ✅ Descriptive keywords

**Examples**:
- Good: `/blog/cloud-computing-explained`
- Bad: `/blog/2024/01/28/a-comprehensive-guide-to-understanding-cloud-computing`

### 1.5 Sitemap

**Automatic generation** at `https://explainmyit.com/sitemap.xml`:

```xml
<urlset>
  <url>
    <loc>https://explainmyit.com/blog/cloud-computing-explained</loc>
    <lastmod>2024-01-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- All blog posts included -->
</urlset>
```

**Submitted to**:
- Google Search Console
- Bing Webmaster Tools

### 1.6 Robots.txt

```
User-agent: *
Allow: /

Sitemap: https://explainmyit.com/sitemap.xml
```

**Per-post control** (via SEO settings):
- Set `noIndex: true` to hide specific posts

---

## Part 2: Content SEO (You Control)

### 2.1 Title Optimization

**Field**: `title` (required) or `seo.metaTitle` (override)

**Guidelines**:
- **Length**: 50-60 characters
- **Front-load keywords**: Important words first
- **Be specific**: Don't be vague
- **Include brand** (automatic): " | Explain My IT"

**Examples**:

✅ **Good**:
- "What is Cloud Computing? Plain English Guide"
- "IT Security Basics for Small Business Owners"
- "MSP vs In-House IT: Which is Right for You?"

❌ **Bad**:
- "Cloud" (too short)
- "Everything You Need to Know About Cloud Computing in 2024" (too long)
- "Article About IT" (vague)

**Testing**:
Use https://moz.com/learn/seo/title-tag to preview how it looks in search results.

### 2.2 Meta Description Optimization

**Field**: `excerpt` (required) or `seo.metaDescription` (override)

**Guidelines**:
- **Length**: 150-160 characters (shows fully)
- **Include primary keyword**: Once, naturally
- **Compelling**: Make them want to click
- **Specific**: What will they learn?
- **No clickbait**: Be honest

**Formula**:
```
[What it is] + [Who it's for] + [What they'll learn/get]
```

**Examples**:

✅ **Good**:
- "A plain-English explanation of cloud computing for business owners. Learn what it is, how it works, and why it matters for your company."
- "Practical IT security basics that small business owners can actually implement. No jargon, just actionable steps."

❌ **Bad**:
- "Read this article about cloud computing." (boring)
- "You won't believe what cloud computing really means!" (clickbait)
- "Cloud computing is a way to store data online using servers..." (too technical)

**Character Counter**: Use https://charactercounter.com/

### 2.3 Keyword Strategy

**Field**: `seo.keywords` (optional but recommended)

**Guidelines**:
- **Number**: 3-5 keywords per post
- **Types**: 
  - 1 primary (main topic)
  - 2-3 secondary (related concepts)
  - 1-2 long-tail (specific phrases)
- **Research**: Use Google, Ubersuggest, or AnswerThePublic

**Example for "Cloud Computing" post**:
- Primary: "cloud computing explained"
- Secondary: "what is the cloud", "cloud for business"
- Long-tail: "cloud computing for small business owners"

**How to use keywords**:
1. **Title**: Include primary keyword
2. **First paragraph**: Use primary keyword naturally
3. **Headings**: Use secondary keywords in H2s
4. **Throughout**: Use variations naturally
5. **Don't overstuff**: Write for humans first

### 2.4 Content Structure

**Heading Hierarchy** (critical for SEO):

```
# Post Title (H1 - automatic)
The main title of your post

## Main Section (H2)
Use for major topics

### Subsection (H3)
Use for specific points within H2 sections

#### Detail (H4 - optional)
Rarely needed, only for very deep nesting
```

**Why it matters**:
- Search engines use headings to understand structure
- Users scan headings to find information
- Proper hierarchy improves accessibility
- Featured snippets often pull from H2/H3 content

**Best practices**:
- ✅ Use H2 for main sections (3-5 per post)
- ✅ Use H3 for subsections (as needed)
- ✅ Never skip levels (H2 → H4)
- ✅ Include keywords in headings naturally
- ❌ Don't overuse headings (every paragraph)
- ❌ Don't use headings for formatting

### 2.5 Content Length

**Optimal length** (SEO research):
- **Minimum**: 500 words (300 words barely index)
- **Sweet spot**: 1,200-1,800 words (best rankings)
- **Maximum**: No limit, but diminishing returns after 2,500

**Your target audience** (business owners):
- Prefer **1,000-1,500 words**
- Scannable (headings, lists, short paragraphs)
- Actionable (practical takeaways)

**Reading time** (automatic):
- Calculated at 200 words/min
- Shows on blog index and post page
- Helps users decide to read

### 2.6 Internal Linking

**Why it matters**:
- Distributes PageRank
- Helps crawlers discover content
- Increases time on site
- Reduces bounce rate

**How to do it**:

```markdown
Learn more about [IT terminology](/blog/it-terms-explained).

If you're considering [cloud vs on-premise](/blog/cloud-vs-onpremise), this guide helps.

Get clarity with [Explain My IT](/).
```

**Guidelines**:
- Link to 2-3 other posts per article
- Use descriptive anchor text (not "click here")
- Link to homepage/product pages when relevant
- Open internal links in same tab
- Only link to relevant content

### 2.7 External Linking

**Why it matters**:
- Adds credibility
- Provides value to readers
- Shows you're not afraid to reference sources

**How to do it**:

```markdown
According to [Gartner's research](https://www.gartner.com/...), cloud adoption has grown 25%.

Learn more at [AWS Documentation](https://docs.aws.amazon.com/...).
```

**Guidelines**:
- Link to authoritative sources (gov, edu, major brands)
- Open in new tab (automatic in Sanity config)
- 1-3 external links per post
- Link to tools/resources readers need
- Avoid linking to competitors

### 2.8 Content Freshness

**Why it matters**:
- Google favors fresh content
- Shows you're active
- Keeps information accurate

**Strategies**:
1. **Publish regularly**: 1-2 posts per week (ideal)
2. **Update old posts**: Add new sections, update stats
3. **Date references**: Avoid "In 2024..." (use "Recently...")
4. **Evergreen topics**: Focus on timeless concepts
5. **Refresh top posts**: Update yearly

**In Sanity**:
- `publishedAt` date tracked automatically
- Update post → ISR refreshes within 1 hour

---

## Part 3: Image SEO (Future Enhancement)

When you add images to posts:

### 3.1 Image Field (Add to Schema)

```typescript
defineField({
  name: 'featuredImage',
  title: 'Featured Image',
  type: 'image',
  options: {
    hotspot: true
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      description: 'Describe the image for SEO and accessibility',
      validation: Rule => Rule.required()
    }
  ]
}),
```

### 3.2 Image Optimization

**Sanity automatically**:
- Converts to WebP
- Generates responsive sizes
- Serves from CDN
- Lazy loads

**Your responsibilities**:
- Descriptive filenames: `cloud-computing-diagram.png`
- Alt text: "Diagram showing cloud computing architecture"
- Proper dimensions: 1200x630px for social sharing
- File size: <200KB before upload

### 3.3 Alt Text Best Practices

✅ **Good**:
- "Screenshot of Sanity Studio blog post editor"
- "Graph showing cloud adoption growth from 2020-2024"
- "Business owner reviewing IT dashboard on laptop"

❌ **Bad**:
- "Image" (useless)
- "Screenshot" (not descriptive)
- "Click here for more info" (spammy)

---

## Part 4: Advanced SEO Features

### 4.1 Canonical URLs

**Automatic**: Each post has a canonical URL

```html
<link rel="canonical" href="https://explainmyit.com/blog/cloud-computing-explained" />
```

**Prevents**:
- Duplicate content penalties
- Content syndication issues

### 4.2 Breadcrumbs

**Current**: Home > Blog > Post Title

**Future enhancement** (if needed):
- Home > Blog > Category > Post
- Structured data for breadcrumbs

### 4.3 Schema Markup (Advanced)

**Current**: Article schema (implemented)

**Future enhancements**:
- HowTo schema (for tutorial posts)
- FAQ schema (for Q&A posts)
- VideoObject schema (when adding videos)

### 4.4 Performance SEO

**Core Web Vitals** (Google ranking factor):

1. **LCP (Largest Contentful Paint)**: < 2.5s
   - ✅ Static pages load fast
   - ✅ ISR pre-renders HTML
   - ✅ CDN delivery

2. **FID (First Input Delay)**: < 100ms
   - ✅ Minimal JavaScript
   - ✅ Deferred loading
   - ✅ No blocking scripts

3. **CLS (Cumulative Layout Shift)**: < 0.1
   - ✅ Fixed dimensions
   - ✅ Font loading optimized
   - ✅ No ads (that shift)

**Mobile Optimization**:
- ✅ Responsive design
- ✅ Touch-friendly (44px tap targets)
- ✅ Fast mobile load times

---

## Part 5: Content Strategy for SEO

### 5.1 Topic Research

**Find topics your audience searches**:

1. **Google Autocomplete**:
   - Type "cloud computing" → see suggestions
   - These are real queries

2. **"People Also Ask"**:
   - Google search results
   - Expand boxes for related questions

3. **AnswerThePublic**:
   - Free tool: answerthepublic.com
   - Shows questions people ask

4. **Your customer questions**:
   - What do clients ask you?
   - Turn FAQs into blog posts

### 5.2 Content Calendar

**Example monthly plan**:

| Week | Topic | Primary Keyword | Type |
|------|-------|-----------------|------|
| 1 | What is Cloud Computing? | "cloud computing explained" | Pillar |
| 2 | Cloud Security for Small Business | "cloud security" | Practical |
| 3 | MSP vs In-House IT | "msp vs in-house" | Comparison |
| 4 | IT Terms Business Owners Need to Know | "IT terminology" | Reference |

**Content types**:
- **Pillar posts**: Comprehensive guides (1,500+ words)
- **How-to posts**: Step-by-step instructions
- **Comparison posts**: A vs B (decision-making)
- **Explainer posts**: What is X?
- **Case studies**: Real examples (future)

### 5.3 Content Clusters

**Strategy**: Link related posts together

**Example cluster**:
- **Pillar**: "Complete Guide to Cloud Computing"
  - Cluster: "Cloud Security Explained"
  - Cluster: "Cloud Cost Management"
  - Cluster: "Choosing a Cloud Provider"
  - Cluster: "Cloud Migration Checklist"

**Benefits**:
- Topical authority
- Better rankings for competitive keywords
- More internal links
- Lower bounce rate

---

## Part 6: Measuring SEO Success

### 6.1 Google Search Console

**Setup** (if not already):
1. Go to https://search.google.com/search-console
2. Add property: "explainmyit.com"
3. Verify ownership (DNS or HTML file)
4. Submit sitemap

**Key metrics to monitor**:
- **Total clicks**: Traffic from Google
- **Impressions**: How often you appear
- **Average CTR**: Click-through rate (aim for >3%)
- **Average position**: Where you rank (aim for <10)
- **Top queries**: What people search
- **Top pages**: Which posts rank

### 6.2 Umami Analytics

**Content metrics**:
- Page views per post
- Reading completion rate (90% scroll)
- Time on page
- Traffic sources (organic, direct, referral)

**Conversion metrics**:
- Blog → Homepage traffic
- Blog → Waitlist signups
- Which posts convert best

### 6.3 Success Benchmarks

**Month 1** (realistic):
- 100-500 organic visitors
- 10-20 posts indexed
- Appear for brand searches

**Month 3**:
- 500-1,500 organic visitors
- Rank for long-tail keywords
- 30-50 posts indexed

**Month 6**:
- 1,500-5,000 organic visitors
- Rank for competitive keywords
- Featured snippets appearing

**Month 12**:
- 5,000-15,000 organic visitors
- Multiple page 1 rankings
- Established topical authority

---

## Part 7: SEO Checklist (Per Post)

### Before Publishing

- [ ] Title is 50-60 characters
- [ ] Title includes primary keyword
- [ ] Excerpt is 150-160 characters
- [ ] Excerpt is compelling
- [ ] Slug is short and descriptive
- [ ] Content is 1,000+ words
- [ ] Uses H2 and H3 headings
- [ ] Keywords used naturally (not stuffed)
- [ ] 2-3 internal links added
- [ ] 1-2 external links added (if relevant)
- [ ] First paragraph hooks the reader
- [ ] Conclusion summarizes key points
- [ ] CTA included (link to homepage/waitlist)

### SEO Settings (Optional)

- [ ] Meta title override (if needed)
- [ ] Meta description override (if needed)
- [ ] 3-5 focus keywords added
- [ ] Image alt text (when added)

### After Publishing

- [ ] Post appears on /blog
- [ ] Post URL works
- [ ] View source - check meta tags
- [ ] Share on social media (test Open Graph)
- [ ] Submit URL to Google Search Console
- [ ] Monitor in Umami

---

## Part 8: Common SEO Mistakes (Avoid These)

### ❌ Keyword Stuffing

**Bad**:
> Cloud computing is great. Cloud computing helps businesses. If you need cloud computing, cloud computing is the solution. Cloud computing, cloud computing, cloud computing.

**Good**:
> Cloud computing helps businesses access IT resources on-demand. Instead of buying servers, companies can rent computing power as needed. This approach offers flexibility and cost savings.

### ❌ Thin Content

**Bad**: 200-word posts with no depth

**Good**: 1,000+ words with real value

### ❌ Duplicate Content

**Bad**: Copying from other sites or republishing same content

**Good**: Original insights, unique angle, your voice

### ❌ Ignoring Mobile

**Bad**: Desktop-only optimization

**Good**: Mobile-first (most traffic is mobile)

### ❌ Slow Load Times

**Bad**: Heavy images, no optimization

**Good**: Optimized images, fast hosting (Vercel ✅)

### ❌ No Internal Links

**Bad**: Isolated posts with no connections

**Good**: Web of related content

### ❌ Vague Titles

**Bad**: "Some Thoughts on IT"

**Good**: "5 IT Security Mistakes Small Businesses Make"

---

## Part 9: Quick Wins (Do These First)

### Week 1: Foundation

1. ✅ Set up Google Search Console
2. ✅ Submit sitemap
3. ✅ Publish 3 high-quality posts
4. ✅ Optimize homepage for "IT reports for business owners"

### Week 2-4: Content

5. ✅ Publish 1-2 posts per week
6. ✅ Focus on long-tail keywords
7. ✅ Add internal links between posts
8. ✅ Share on social media

### Month 2-3: Optimization

9. ✅ Analyze top-performing posts
10. ✅ Update old posts with new info
11. ✅ Target medium-difficulty keywords
12. ✅ Build some backlinks (guest posts, directories)

### Month 4+: Scale

13. ✅ Increase publishing frequency
14. ✅ Target competitive keywords
15. ✅ Create content clusters
16. ✅ Expand into related topics

---

## Part 10: SEO Resources

### Tools (Free)

- **Google Search Console**: Search performance
- **Ubersuggest**: Keyword research (free tier)
- **AnswerThePublic**: Content ideas
- **Hemingway Editor**: Readability
- **Grammarly**: Writing quality

### Tools (Paid, Optional)

- **Ahrefs**: Comprehensive SEO ($99/mo)
- **SEMrush**: Competitor analysis ($119/mo)
- **Moz Pro**: All-in-one SEO ($99/mo)

**Recommendation**: Start with free tools, invest in paid later

### Learning Resources

- **Google SEO Starter Guide**: https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Moz Beginner's Guide**: https://moz.com/beginners-guide-to-seo
- **Backlinko Blog**: https://backlinko.com/blog

---

## Summary

**Your Sanity blog is fully optimized for SEO**:

✅ **Technical SEO**: All meta tags, structured data, semantic HTML  
✅ **On-page SEO**: Title, description, headings, content  
✅ **Performance SEO**: Fast load times, mobile-optimized  
✅ **Content SEO**: Proper structure, keyword optimization  
✅ **Analytics**: Track performance with Umami & GSC  

**Your job**: Write great content consistently

**The system handles**: All technical SEO automatically

---

**Now go create content that ranks and converts!** 🚀
