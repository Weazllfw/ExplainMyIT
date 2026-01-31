import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-brand-navy rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-[18px] font-bold text-brand-navy">Explain My IT</span>
            </div>
            <p className="text-brand-muted text-sm max-w-sm">
              Plain-English IT reports for business owners
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-brand-navy">Product</h4>
              <div className="space-y-2">
                <Link 
                  href="/how-it-works" 
                  className="text-brand-cyan hover:text-brand-navy transition-colors text-sm block"
                >
                  How It Works
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-brand-cyan hover:text-brand-navy transition-colors text-sm block"
                >
                  Pricing
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-brand-navy">Contact</h4>
              <a 
                href="mailto:contact@explainmyit.com" 
                className="text-brand-cyan hover:text-brand-navy transition-colors text-sm"
              >
                contact@explainmyit.com
              </a>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-brand-navy">Legal</h4>
              <div className="space-y-2">
                <Link 
                  href="/privacy" 
                  className="text-brand-cyan hover:text-brand-navy transition-colors text-sm block"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-brand-cyan hover:text-brand-navy transition-colors text-sm block"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-muted">
          <p>&copy; {new Date().getFullYear()} Explain My IT | Not affiliated with any MSP</p>
          <p className="text-xs">Not affiliated with any MSP or vendor</p>
        </div>
      </div>
    </footer>
  );
}
