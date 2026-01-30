import Link from 'next/link';
import HeaderActions from './HeaderActions';

export default function Header() {
  return (
    <header className="bg-white border-b border-brand-border sticky top-0 z-50 shadow-sm backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-brand-navy rounded-[10px] flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-[20px] font-bold text-brand-navy">
              Explain My IT
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <ul className="hidden md:flex items-center gap-8">
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-brand-muted hover:text-brand-navy transition-colors font-medium text-[15px]"
                  data-umami-event="nav-how-it-works"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-brand-muted hover:text-brand-navy transition-colors font-medium text-[15px]"
                  data-umami-event="nav-pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-brand-muted hover:text-brand-navy transition-colors font-medium text-[15px]"
                  data-umami-event="nav-blog"
                >
                  Blog
                </Link>
              </li>
            </ul>
            <HeaderActions />
          </div>
        </div>
      </nav>
    </header>
  );
}
