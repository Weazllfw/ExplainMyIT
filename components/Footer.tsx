import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Explain My IT</span>
            </div>
            <p className="text-gray-600 text-sm max-w-sm">
              Plain-English IT reports for business owners
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-900">Contact</h4>
              <a 
                href="mailto:contact@explainmyit.com" 
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                contact@explainmyit.com
              </a>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-900">Legal</h4>
              <div className="space-y-2">
                <Link 
                  href="/privacy" 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm block"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-900">Pricing</h4>
              <p className="text-gray-600 text-sm max-w-xs">
                Simple, subscription-based, designed to stay in the background of normal business software spend.
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Explain My IT | Not affiliated with any MSP</p>
          <p className="text-xs">Not affiliated with any MSP or vendor</p>
        </div>
      </div>
    </footer>
  );
}
