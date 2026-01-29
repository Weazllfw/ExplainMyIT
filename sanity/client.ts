import { createClient } from 'next-sanity';

// Check if Sanity is configured
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Only create client if Sanity is configured
export const client = projectId 
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-28',
      useCdn: process.env.NODE_ENV === 'production',
      token: process.env.SANITY_API_TOKEN,
    })
  : null;

// Helper to check if Sanity is configured
export const isSanityConfigured = !!projectId;

/**
 * GROQ queries for blog posts
 */

// Get all published posts, sorted by date
export const allPostsQuery = `
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 200),
    body,
    seo
  }
`;

// Get single post by slug
export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 200),
    body,
    seo
  }
`;

// Get all post slugs (for static generation)
export const postSlugsQuery = `
  *[_type == "post" && !(_id in path("drafts.**"))].slug.current
`;
