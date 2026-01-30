/**
 * Social Proof Component
 * 
 * Anonymous proof of usage without logos or testimonials.
 * No marketing stink, just factual statement.
 * 
 * Purpose: Social proof that this is a real tool used by real people.
 */

export function SocialProof() {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 print:hidden">
      <p className="text-xs text-gray-600 text-center leading-relaxed">
        Used by founders, operators, and finance leaders at small and mid-sized companies 
        to understand their IT setup without technical jargon.
      </p>
    </div>
  );
}
