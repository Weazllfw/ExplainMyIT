# Explain My IT - Marketing Site

Plain-English IT reality reports for business owners.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX (file-based)
- **Deployment:** Vercel
- **Email:** Brevo
- **Analytics:** Umami

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and add your environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update the following variables in `.env.local`:
   - `BREVO_API_KEY` - Your Brevo API key
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - Your Umami website ID
   - `NEXT_PUBLIC_UMAMI_SRC` - Your Umami script URL

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── blog/            # Blog pages
│   ├── privacy/         # Privacy policy page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/          # React components
├── content/            # MDX blog posts
│   └── blog/
├── lib/                # Utilities
│   ├── blog.ts         # Blog helpers
│   └── brevo.ts        # Email integration
├── public/             # Static assets
└── types/              # TypeScript types
```

## Adding Blog Posts

Create a new `.mdx` file in `content/blog/` with frontmatter:

```mdx
---
title: "Your Post Title"
date: "2026-01-28"
excerpt: "A brief description of your post"
---

Your content here...
```

## Brevo Setup

1. Create a Brevo account at https://brevo.com
2. Verify your sender email/domain
3. Create a contact list for "Early Access Waitlist"
4. Get your API key from Settings > API Keys
5. Update the list ID in `lib/brevo.ts` (line 23)

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables (Vercel)

Add these in your Vercel project settings:

- `BREVO_API_KEY`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- `NEXT_PUBLIC_UMAMI_SRC`

## SEO

- Sitemap: Auto-generated at `/sitemap.xml`
- Robots.txt: `/robots.txt`
- Metadata: Configured in `app/layout.tsx`
- Structured data: JSON-LD schema included

## Documentation

- [Implementation Plan](./Docs/implementation-plan.md) - Full v1 specification
- [Product Definition](./Docs/readme.md) - Canonical product spec

## License

All rights reserved.
