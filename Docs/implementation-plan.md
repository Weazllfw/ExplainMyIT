# Explain My IT - Complete Implementation Plan v1
## Autonomous Execution Guide

---

## 1. TECHNICAL STACK (LOCKED)

### Core Framework
- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (for styling)

### Infrastructure
- **Deployment**: Vercel
- **Email Service**: Brevo (for early access waitlist)
- **Analytics**: Umami (self-hosted or cloud)
- **Future Auth**: Supabase (foundation only, no login UI in v1)

### Content Management
- **Blog**: MDX files (file-based, no CMS)
- **Static Generation**: ISR for blog posts

---

## 2. PROJECT STRUCTURE

```
/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Homepage
│   ├── privacy/
│   │   └── page.tsx            # Privacy policy
│   ├── blog/
│   │   ├── page.tsx            # Blog index
│   │   └── [slug]/
│   │       └── page.tsx        # Individual blog post
│   └── api/
│       └── waitlist/
│           └── route.ts        # Brevo integration
├── components/
│   ├── WaitlistForm.tsx        # Early access form
│   ├── BlogCard.tsx            # Blog post preview
│   ├── Header.tsx              # Site navigation
│   └── Footer.tsx              # Site footer
├── content/
│   └── blog/
│       └── *.mdx               # Blog posts
├── lib/
│   ├── brevo.ts                # Brevo API wrapper
│   ├── blog.ts                 # Blog utilities (MDX parser)
│   └── analytics.ts            # Umami tracking
├── public/
│   ├── robots.txt
│   └── sitemap.xml             # Generated or static
└── types/
    └── blog.ts                 # Blog post types
```

---

## 3. PHASE 1: CORE PAGES & FOUNDATION

### 3.1 Root Layout (`app/layout.tsx`)

**Requirements:**
- HTML lang="en"
- Proper viewport meta
- SEO metadata template
- Umami analytics script injection
- JSON-LD structured data (Organization + SoftwareApplication)
- Clean, semantic HTML structure
- Font loading (system fonts preferred for performance)

**Metadata Template:**
```typescript
export const metadata = {
  title: {
    default: 'Explain My IT — Plain-English IT Reports for Business Owners',
    template: '%s | Explain My IT'
  },
  description: 'Explain My IT produces plain-English IT reality reports for business owners. No jargon, no dashboards, no fixes — just clarity.',
  keywords: ['IT explained for business owners', 'understand my IT', 'IT clarity for owners', 'IT reality report', 'business owner IT understanding'],
  authors: [{ name: 'Explain My IT' }],
  canonical: 'https://explainmyit.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://explainmyit.com',
    siteName: 'Explain My IT',
    title: 'Explain My IT — Plain-English IT Reports for Business Owners',
    description: 'Plain-English IT reality reports for business owners. No jargon, no dashboards, no fixes — just clarity.'
  }
}
```

**JSON-LD Schema (required):**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Explain My IT",
      "url": "https://explainmyit.com",
      "logo": "https://explainmyit.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@explainmyit.com",
        "contactType": "customer service"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Explain My IT",
      "applicationCategory": "BusinessApplication",
      "description": "Plain-English IT reports for business owners",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
}
```

**Umami Integration:**
```typescript
// In <head> or <body>
<script defer src="https://YOUR-UMAMI-INSTANCE/script.js" data-website-id="YOUR-WEBSITE-ID"></script>
```

### 3.2 Homepage (`app/page.tsx`)

**Section Order (Critical - Do Not Rearrange):**

1. **Hero Section (Above Fold)**
   - H1: "Explain My IT" (only H1 on page)
   - H2: "Plain-English IT reality reports for business owners."
   - Body copy (3-4 lines):
     ```
     Your business runs on IT — but it's rarely explained in language owners can actually understand.
     
     Explain My IT produces a calm, readable report that explains what your IT setup means, using publicly observable information.
     
     No jargon. No dashboards. No fixes. Just clarity.
     ```
   - CTA: "Join Early Access" (button, primary style)

2. **"Who This Is For"**
   - H2: "Who This Is For"
   - Bullet list (owner language only):
     - Business owners who rely on IT but don't live in it
     - Companies with internal IT or an MSP
     - Owners preparing for insurance, growth, or transitions
     - Anyone who has ever thought: "I don't actually know how this works"
   - No technical terms allowed

3. **"What This Is Not" (CRITICAL FOR TRUST)**
   - H2: "What This Is Not"
   - Bullet list:
     - Not monitoring
     - Not a security audit
     - Not a managed service
     - Not remediation
     - Not continuous access
   - Follow-up paragraph:
     ```
     Explain My IT exists to explain, not to manage or sell fixes.
     ```
   - Do not soften this section

4. **"What You Get"**
   - H2: "What You Get"
   - Bullet list (describe artifact, not features):
     - A written report, not a dashboard
     - Clear explanations of what matters and why
     - Business-level risks and assumptions
     - No blame, no fear, no upsell
   - Optional closing line:
     ```
     Think of it as an owner-level memo, not an IT tool.
     ```

5. **"How It Works" (High Level)**
   - H2: "How It Works"
   - Numbered or bullet list:
     1. We review publicly observable IT signals
     2. We interpret them using an owner-first lens
     3. You receive a plain-English report
   - No promises about timelines or pricing

6. **Early Access / Waitlist Form**
   - H2: "Join Early Access"
   - Form fields:
     - Email (required, validated)
     - Company size range (optional, dropdown: "1-10", "11-50", "51-150", "151+")
     - "Do you have internal IT?" (optional, radio: "Yes", "MSP", "Not sure")
   - CTA button: "Get notified when reports launch"
   - Success message after submit
   - Error handling (clear, non-technical)

### 3.3 Privacy Policy (`app/privacy/page.tsx`)

**Required Content (Minimal v1):**
- H1: "Privacy Policy"
- Last updated date
- What data is collected (email, optional company info)
- How email is used (early access notifications only)
- No resale statement
- Data storage mention (Brevo)
- Contact email for questions
- Simple, readable language

**Template:**
```
# Privacy Policy

Last updated: [DATE]

## What We Collect
- Email address (required for early access)
- Optional: company size and IT setup information

## How We Use It
- Early access notifications for Explain My IT reports
- Product updates (you can unsubscribe anytime)
- We will never sell your data

## Where It's Stored
- Email data is stored with Brevo (our email service provider)

## Contact
Questions about privacy? Email us at [contact email]
```

### 3.4 Header Component (`components/Header.tsx`)

**Requirements:**
- Logo/Site name (links to homepage)
- Navigation links: Home, Blog, Privacy
- Mobile responsive (hamburger menu <768px)
- Semantic HTML (`<nav>`, `<ul>`, `<li>`)
- Clean, minimal design
- Sticky or static (decide based on design)

### 3.5 Footer Component (`components/Footer.tsx`)

**Required Elements:**
- One-sentence description: "Plain-English IT reports for business owners"
- Contact email (linked)
- Privacy policy link
- Optional (but recommended): "Not affiliated with any MSP or vendor"
- Copyright notice
- Optional: Blog link
- Minimal social links (if any exist)

---

## 4. PHASE 2: BLOG SYSTEM

### 4.1 Blog Purpose (For v1)

The blog serves as:
1. **SEO Content Hub** - Target long-tail keywords around "IT clarity for business owners"
2. **Trust Builder** - Demonstrate calm, clear, non-technical communication
3. **Education Channel** - Help owners understand IT concepts in plain English

**Content Strategy:**
- Owner-focused topics only
- No how-to guides for IT admins
- No vendor comparisons
- No fear-based content
- Examples: "What does 'cloud-first' actually mean?", "Understanding your IT invoice"

### 4.2 Blog Index (`app/blog/page.tsx`)

**Requirements:**
- H1: "Blog" or "IT Explained"
- Chronological list of blog posts (newest first)
- Each post shows:
  - Title (linked)
  - Publication date
  - Excerpt (150 chars max)
  - Read time estimate (optional)
- Clean, scannable layout
- Pagination (if >10 posts)

**Metadata:**
```typescript
export const metadata = {
  title: 'Blog',
  description: 'Plain-English explanations of IT concepts for business owners.'
}
```

### 4.3 Blog Post Page (`app/blog/[slug]/page.tsx`)

**Requirements:**
- H1: Post title
- Publication date
- Author (optional, can be "Explain My IT")
- Article content (MDX rendered)
- Reading time estimate
- Clean typography (readable line length, spacing)
- Code syntax highlighting (if needed)
- Proper heading hierarchy (H2, H3 only within content)

**Metadata (Dynamic):**
```typescript
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      authors: ['Explain My IT']
    }
  }
}
```

**JSON-LD Schema (Article):**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Post Title]",
  "datePublished": "[ISO Date]",
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
  "description": "[Post Excerpt]"
}
```

### 4.4 Blog Utilities (`lib/blog.ts`)

**Required Functions:**
```typescript
interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime?: number
}

// Get all posts (sorted by date, newest first)
export async function getAllPosts(): Promise<BlogPost[]>

// Get single post by slug
export async function getPost(slug: string): Promise<BlogPost>

// Get post slugs for generateStaticParams
export async function getPostSlugs(): Promise<string[]>

// Parse frontmatter + MDX content
// Calculate reading time (optional)
```

**MDX Frontmatter Schema:**
```yaml
---
title: "Post Title"
date: "2026-01-28"
excerpt: "Short description for previews and meta description"
---
```

### 4.5 Blog Content Guidelines (Pass to Blog Authors)

**Hard Rules:**
- Write for business owners, not IT professionals
- Explain concepts, don't prescribe solutions
- No acronyms without explanation
- No fear language or urgency tactics
- No vendor mentions
- Calm, factual tone
- Use examples and analogies
- Keep posts under 1000 words (for v1)

**Example Topics (Starter List):**
1. "What does 'the cloud' actually mean for your business?"
2. "Understanding your IT service bill"
3. "What is a domain, and why does it matter?"
4. "IT insurance requirements: A plain-English guide"
5. "Single point of failure: What it means in owner language"

---

## 5. EMAIL INTEGRATION (BREVO)

### 5.1 Brevo Setup (Pre-Code)

1. Create Brevo account
2. Verify sender email/domain
3. Create contact list: "Early Access Waitlist"
4. Get API key
5. Optional: Create welcome email template in Brevo

### 5.2 API Route (`app/api/waitlist/route.ts`)

**Endpoint:** POST `/api/waitlist`

**Request Body:**
```json
{
  "email": "owner@company.com",
  "companySize": "11-50",
  "hasIT": "MSP"
}
```

**Validation:**
- Email: required, valid format
- companySize: optional, enum
- hasIT: optional, enum

**Brevo Integration:**
- Add contact to list
- Set contact attributes (companySize, hasIT)
- Handle errors gracefully
- Return success/error JSON

**Response:**
```json
{
  "success": true,
  "message": "You're on the list! Check your email for confirmation."
}
```

### 5.3 Brevo Client (`lib/brevo.ts`)

**Required Function:**
```typescript
interface WaitlistData {
  email: string
  companySize?: string
  hasIT?: string
}

export async function addToWaitlist(data: WaitlistData): Promise<{ success: boolean; error?: string }>
```

**Implementation:**
- Use Brevo REST API v3
- Endpoint: `POST https://api.brevo.com/v3/contacts`
- Headers: `api-key`, `content-type: application/json`
- Body: email, listIds, attributes
- Error handling for duplicate emails (treat as success)

### 5.4 Waitlist Form Component (`components/WaitlistForm.tsx`)

**Requirements:**
- Client component (`'use client'`)
- Form submission via fetch to `/api/waitlist`
- Loading state during submission
- Success message (replace form or show below)
- Error message (show above form, red, clear)
- Email validation (frontend + backend)
- Accessible labels and error announcements

**UX Flow:**
1. User fills form
2. Clicks "Get notified when reports launch"
3. Button shows loading state ("Submitting...")
4. Success: Form replaced with "You're on the list! Check your email."
5. Error: "Something went wrong. Please try again." (above form, form still visible)

---

## 6. SEO IMPLEMENTATION CHECKLIST

### 6.1 Technical SEO (Build-Time - MANDATORY)

- [ ] HTTPS enforced (Vercel default)
- [ ] Canonical URL set on every page
- [ ] Choose www or non-www (redirect other)
- [ ] `robots.txt` present and permissive:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://explainmyit.com/sitemap.xml
  ```
- [ ] XML sitemap at `/sitemap.xml`:
  - Homepage
  - Privacy page
  - Blog index
  - All blog posts
- [ ] Proper meta viewport in layout
- [ ] Clean URLs (no query params for routing)
- [ ] Open Graph tags (all pages)

### 6.2 Page-Level Metadata

**Homepage:**
- Title: "Explain My IT — Plain-English IT Reports for Business Owners" (≤60 chars)
- Description: "Explain My IT produces plain-English IT reality reports for business owners. No jargon, no dashboards, no fixes — just clarity." (≤155 chars)

**Privacy:**
- Title: "Privacy Policy"
- Description: "How Explain My IT handles your data"

**Blog Index:**
- Title: "Blog"
- Description: "Plain-English explanations of IT concepts for business owners."

**Blog Posts:**
- Title: `{post.title}`
- Description: `{post.excerpt}`

### 6.3 Heading Structure (All Pages)

- [ ] One H1 per page only
- [ ] Logical H2 sections
- [ ] No skipped heading levels (H1 → H2 → H3, never H1 → H3)
- [ ] Headings for structure, not styling

### 6.4 Structured Data (JSON-LD)

- [ ] Organization schema (root layout)
- [ ] SoftwareApplication schema (root layout)
- [ ] Article schema (blog posts)
- [ ] BreadcrumbList (optional, for blog)

### 6.5 Performance / Core Web Vitals

- [ ] Static generation (SSG) for homepage, privacy, blog
- [ ] ISR for blog posts (revalidate: 3600)
- [ ] No heavy JavaScript on homepage
- [ ] Optimized images (Next.js Image component)
- [ ] Minimal third-party scripts:
  - Umami (async/defer)
  - No others in v1
- [ ] Font optimization (use `next/font`)
- [ ] Lighthouse score: 90+ (mobile & desktop)

### 6.6 Content SEO (Keyword Strategy)

**Primary Keywords (Homepage):**
- "IT explained for business owners"
- "understand my IT"
- "IT clarity for owners"
- "IT reality report"
- "business owner IT understanding"

**Avoid:**
- "cybersecurity"
- "monitoring"
- "threat detection"
- "managed IT services"

**Blog Keywords (Long-Tail):**
- "what does [IT term] mean for business owners"
- "understanding [IT concept] plain English"
- "IT questions business owners ask"

### 6.7 Indexing Setup (Post-Deploy)

- [ ] Google Search Console setup
- [ ] Submit sitemap to GSC
- [ ] Umami analytics installed
- [ ] Track conversion event: "Waitlist Signup"
- [ ] Optional: Bing Webmaster Tools

---

## 7. DEPLOYMENT (VERCEL)

### 7.1 Pre-Deployment Checklist

- [ ] All environment variables set in Vercel:
  - `BREVO_API_KEY`
  - `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
  - `NEXT_PUBLIC_UMAMI_SRC`
- [ ] Domain configured (explainmyit.com)
- [ ] HTTPS redirect enabled
- [ ] www → non-www redirect (or vice versa)

### 7.2 Build Configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 7.3 Post-Deployment

- [ ] Test homepage loads
- [ ] Test waitlist form submission
- [ ] Test blog index and post pages
- [ ] Test privacy page
- [ ] Verify analytics tracking (Umami)
- [ ] Check Lighthouse scores
- [ ] Submit sitemap to Google Search Console
- [ ] Send test email through Brevo

---

## 8. FUTURE-PROOFING (NO UI IN V1)

### 8.1 Supabase Foundation (Setup Only)

**Tasks:**
1. Create Supabase project
2. Note project URL and anon key
3. Install `@supabase/supabase-js`
4. Create `lib/supabase.ts` client wrapper
5. Do NOT build login UI
6. Do NOT create auth pages
7. Do NOT add "Sign In" buttons

**Purpose:** 
- Ready for v2 when scan tool launches
- No user-facing auth in v1

---

## 9. SUCCESS CRITERIA (v1 Launch)

The v1 site is successful if:

1. **Clarity Test**: A business owner understands the product in under 30 seconds
2. **Positioning Test**: No one asks "is this monitoring?" or "do you manage IT?"
3. **Trust Test**: People are willing to provide their email
4. **Technical Test**: Lighthouse score >90, Core Web Vitals pass
5. **SEO Test**: GSC shows no critical errors, sitemap indexed
6. **Conversion Test**: Waitlist form works, emails appear in Brevo
7. **Content Test**: 3-5 blog posts published, owner-readable
8. **Future-Ready Test**: No rewrites needed when scan launches

---

## 10. IMPLEMENTATION ORDER (AUTONOMOUS EXECUTION)

### Stage 1: Foundation (Day 1-2)
1. Initialize Next.js project with TypeScript
2. Install dependencies (Tailwind, MDX, Brevo SDK)
3. Set up project structure (folders, types)
4. Configure `next.config.js` (MDX support)
5. Create root layout with metadata
6. Add Umami analytics script
7. Implement JSON-LD structured data

### Stage 2: Core Pages (Day 2-3)
8. Build Homepage (all sections per spec)
9. Build Privacy page
10. Build Header component
11. Build Footer component
12. Implement responsive design
13. Test mobile layout

### Stage 3: Waitlist Integration (Day 3-4)
14. Set up Brevo API client (`lib/brevo.ts`)
15. Create API route (`app/api/waitlist/route.ts`)
16. Build WaitlistForm component
17. Test form submission end-to-end
18. Handle errors and edge cases

### Stage 4: Blog System (Day 4-5)
19. Create blog utilities (`lib/blog.ts`)
20. Build blog index page
21. Build blog post page with dynamic routes
22. Set up MDX rendering
23. Add Article schema (JSON-LD)
24. Create 3-5 starter blog posts (owner-focused content)
25. Test blog navigation

### Stage 5: SEO & Performance (Day 5-6)
26. Generate sitemap (static or dynamic)
27. Create robots.txt
28. Optimize images (if any)
29. Run Lighthouse audit
30. Fix any performance issues
31. Verify all metadata
32. Check heading structure

### Stage 6: Deployment (Day 6-7)
33. Set up Vercel project
34. Configure environment variables
35. Set up custom domain
36. Deploy to production
37. Verify HTTPS and redirects
38. Test production site (all pages)
39. Submit sitemap to GSC
40. Verify Umami tracking

### Stage 7: Polish & Launch (Day 7)
41. Final copy review (tone check)
42. Final accessibility check
43. Cross-browser testing
44. Mobile device testing
45. Waitlist test with real email
46. Monitor initial analytics

---

## 11. COPY TONE RULES (ENFORCE EVERYWHERE)

**Hard Rules - No Exceptions:**
1. Write for non-technical readers
2. Use complete sentences (no marketing fragments)
3. Avoid acronyms unless explained immediately
4. No fear language ("breach", "hack", "urgent")
5. No vendor mentions
6. No "AI" hype or buzzwords
7. Calm, factual, adult tone
8. No exclamation points (except CTA buttons, sparingly)

**Litmus Test:**
- If a sentence sounds like an MSP blog → delete it
- If it creates anxiety → rewrite it
- If a business owner would need to Google something → explain it

---

## 12. TECHNICAL NOTES

### Dependencies (package.json)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.10",
    "next-mdx-remote": "^4.4.1",
    "gray-matter": "^4.0.3",
    "sib-api-v3-sdk": "^8.5.0"
  }
}
```

### Environment Variables
```bash
# .env.local (DO NOT COMMIT)
BREVO_API_KEY=your_brevo_api_key
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_website_id
NEXT_PUBLIC_UMAMI_SRC=https://your-umami-instance.com/script.js

# Future (not used in v1)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Git Ignore
```
node_modules/
.next/
.env.local
.env*.local
.vercel
.DS_Store
```

---

## 13. CONTENT ASSETS NEEDED

### Images
- Logo (SVG preferred, 200x60px approximate)
- Favicon (32x32, 16x16)
- Open Graph image (1200x630px)

### Copy
- Contact email address (for footer, privacy, schema)
- Company size options (confirmed: "1-10", "11-50", "51-150", "151+")
- IT setup options (confirmed: "Yes", "MSP", "Not sure")

### Blog Posts (3-5 Starter Posts)
- Post 1: "What does 'the cloud' actually mean for your business?"
- Post 2: "Understanding your IT service bill"
- Post 3: "What is a domain, and why does it matter?"
- Post 4: (Optional) "IT insurance requirements: A plain-English guide"
- Post 5: (Optional) "Single point of failure: What it means in owner language"

---

## 14. AUTONOMOUS EXECUTION PROTOCOL

### Decision-Making Rules
1. **If spec is clear**: Implement exactly as written
2. **If spec is ambiguous**: Choose the simpler option
3. **If copy is needed**: Follow tone rules, keep it minimal
4. **If design is unspecified**: Use clean, minimal, readable defaults
5. **If performance trade-off**: Always choose performance

### When to Pause for Confirmation
- Never pause for standard implementation decisions
- Only pause if something fundamentally breaks the product definition
- Otherwise: make sensible default choices and proceed

### Quality Gates (Check Before Moving to Next Stage)
- [ ] Code compiles without errors
- [ ] Pages render correctly
- [ ] Forms submit successfully
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Lighthouse score >90

---

## 15. FINAL CHECKLIST (PRE-LAUNCH)

- [ ] Homepage: All sections present and accurate
- [ ] Privacy policy: Complete and accurate
- [ ] Blog: Index + at least 3 posts published
- [ ] Waitlist form: Submits to Brevo successfully
- [ ] Analytics: Umami tracking verified
- [ ] SEO: Sitemap submitted to GSC
- [ ] Performance: Lighthouse >90 (mobile & desktop)
- [ ] Accessibility: No critical WCAG violations
- [ ] Mobile: All pages tested on <768px
- [ ] Copy: Tone check passed (no MSP-speak)
- [ ] Links: All internal links work
- [ ] Errors: No console errors
- [ ] Structured data: Validated via Google Rich Results Test

---

**END OF IMPLEMENTATION PLAN**

This document is the source of truth for v1 development.
All decisions, copy, and structure align with the canonical product definition.

**Launch when checklist is complete. Do not wait for perfection.**