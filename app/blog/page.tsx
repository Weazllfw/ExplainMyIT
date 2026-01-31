import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/sanity-blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Plain-English explanations of IT concepts for business owners.',
  alternates: {
    canonical: 'https://explainmyit.com/blog',
  },
  openGraph: {
    title: 'IT Explained — Explain My IT Blog',
    description: 'Plain-English explanations of IT concepts for business owners.',
    url: 'https://explainmyit.com/blog',
    type: 'website',
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="mb-4 text-gray-900">IT Explained</h1>
            <p className="text-xl text-gray-600">
              Plain-English explanations of IT concepts for business owners.
            </p>
          </div>
        </section>

        <section className="container-section">
          <div className="max-w-4xl mx-auto">
            {posts.length === 0 ? (
              <p className="text-gray-600 text-center">No posts yet. Check back soon!</p>
            ) : (
              <div className="space-y-12">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all hover:border-slate-300">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 group-hover:text-slate-700 transition-colors">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                          {post.readingTime && (
                            <>
                              <span>•</span>
                              <span>{post.readingTime} min read</span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4">{post.excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-slate-700 font-semibold group-hover:gap-3 transition-all">
                          Read article
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
