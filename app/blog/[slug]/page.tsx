import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPostTracker from '@/components/BlogPostTracker';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import { getPost, getPostSlugs } from '@/lib/sanity-blog';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getPost(params.slug);
    
    // Use SEO overrides if available
    const metaTitle = post.seo?.metaTitle || post.title;
    const metaDescription = post.seo?.metaDescription || post.excerpt;
    const noIndex = post.seo?.noIndex || false;
    
    return {
      title: metaTitle,
      description: metaDescription,
      keywords: post.seo?.keywords?.join(', '),
      robots: noIndex ? 'noindex, nofollow' : 'index, follow',
      openGraph: {
        type: 'article',
        publishedTime: post.date,
        authors: ['Explain My IT'],
        title: metaTitle,
        description: metaDescription,
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  let post;
  try {
    post = await getPost(params.slug);
  } catch {
    notFound();
  }

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Explain My IT',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Explain My IT',
      logo: {
        '@type': 'ImageObject',
        url: 'https://explainmyit.com/logo.png',
      },
    },
    description: post.excerpt,
  };

  return (
    <>
      <BlogPostTracker slug={post.slug} readingTime={post.readingTime} />
      <Header />
      <main className="bg-white">
        <article className="container-section">
          <div className="max-w-3xl mx-auto">
            <header className="mb-12 text-center">
              <h1 className="mb-6 leading-tight">{post.title}</h1>
              <div className="flex items-center justify-center gap-4 text-gray-500">
                <time dateTime={post.date} className="font-medium">{formatDate(post.date)}</time>
                {post.readingTime && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{post.readingTime} min read</span>
                  </>
                )}
              </div>
            </header>
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-slate-700 prose-a:no-underline hover:prose-a:underline">
              {Array.isArray(post.content) ? (
                <PortableTextRenderer value={post.content} />
              ) : (
                <MDXRemote source={post.content} />
              )}
            </div>
            
            <div className="mt-16 pt-12 border-t border-gray-200">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all articles
              </Link>
            </div>
          </div>
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
