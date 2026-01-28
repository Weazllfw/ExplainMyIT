import { client, allPostsQuery, postBySlugQuery, postSlugsQuery } from '@/sanity/client';
import type { BlogPost } from '@/types/blog';
import type { SanityBlogPost } from '@/types/sanity';

/**
 * Convert Sanity post to BlogPost format
 * Maintains compatibility with existing blog components
 */
function convertSanityPost(sanityPost: SanityBlogPost): BlogPost {
  return {
    slug: sanityPost.slug.current,
    title: sanityPost.title,
    date: sanityPost.publishedAt,
    excerpt: sanityPost.excerpt,
    content: sanityPost.body, // PortableText content
    readingTime: sanityPost.readingTime || calculateReadingTime(sanityPost.body),
    seo: sanityPost.seo,
  };
}

/**
 * Calculate reading time from Portable Text
 */
function calculateReadingTime(body: any[]): number {
  const wordsPerMinute = 200;
  let words = 0;

  body.forEach((block) => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          words += child.text.trim().split(/\s+/).length;
        }
      });
    }
  });

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Get all published blog posts
 * Uses ISR with 1-hour revalidation for optimal SEO + performance
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityBlogPost[]>(allPostsQuery, {}, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    return posts.map(convertSanityPost);
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
}

/**
 * Get single blog post by slug
 * Uses ISR with 1-hour revalidation
 */
export async function getPost(slug: string): Promise<BlogPost> {
  try {
    const post = await client.fetch<SanityBlogPost>(
      postBySlugQuery,
      { slug },
      { next: { revalidate: 3600 } }
    );

    if (!post) {
      throw new Error(`Post not found: ${slug}`);
    }

    return convertSanityPost(post);
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    throw error;
  }
}

/**
 * Get all post slugs for static generation
 * Uses ISR with 1-hour revalidation
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery, {}, {
      next: { revalidate: 3600 },
    });

    return slugs;
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

/**
 * Purge Sanity CDN cache for a specific post (for webhooks)
 * Call this after publishing/updating a post for instant updates
 */
export async function purgeCacheForPost(slug: string): Promise<void> {
  // This would be called from an API route triggered by Sanity webhooks
  // For now, it's a placeholder for future webhook integration
  console.log(`Cache purge requested for: ${slug}`);
}
