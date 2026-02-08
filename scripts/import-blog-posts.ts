/**
 * Import Blog Posts from Markdown to Sanity
 * 
 * Usage: npm run import-blog-posts
 * 
 * Reads markdown files from Docs/BlogSeed/ and imports them into Sanity CMS
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!, // You'll need to add this
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function importBlogPosts() {
  const blogSeedDir = path.join(process.cwd(), 'Docs', 'BlogSeed');
  const files = fs.readdirSync(blogSeedDir).filter(file => 
    file.endsWith('.md') && !file.includes('ALL-ARTICLES') && !file.includes('README')
  );

  console.log(`Found ${files.length} blog posts to import`);

  for (const file of files) {
    const filePath = path.join(blogSeedDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);

    console.log(`\n📝 Importing: ${frontmatter.title}`);

    // Create Sanity document
    const doc = {
      _type: 'post',
      title: frontmatter.title,
      slug: {
        _type: 'slug',
        current: frontmatter.slug,
      },
      excerpt: frontmatter.excerpt,
      publishedAt: new Date(frontmatter.publishedAt).toISOString(),
      body: content, // The markdown content
      seo: frontmatter.seo ? {
        _type: 'object',
        metaTitle: frontmatter.seo.metaTitle,
        metaDescription: frontmatter.seo.metaDescription,
        keywords: frontmatter.seo.keywords,
        noIndex: frontmatter.seo.noIndex || false,
      } : undefined,
    };

    try {
      const result = await client.create(doc);
      console.log(`✅ Created: ${result._id}`);
    } catch (error: any) {
      console.error(`❌ Failed to import ${frontmatter.title}:`, error.message);
    }
  }

  console.log('\n🎉 Import complete!');
}

importBlogPosts().catch(console.error);
