/**
 * Trust Signals Component
 * 
 * Small trust indicators to reduce friction and build confidence.
 * Addresses common objections before submission.
 */

export function TrustSignals() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>No credit card required</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Results in ~60 seconds</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Privacy-focused</span>
      </div>
      
      <a 
        href="/privacy" 
        className="text-gray-400 hover:text-brand-navy transition-colors underline"
      >
        Privacy Policy
      </a>
    </div>
  );
}
