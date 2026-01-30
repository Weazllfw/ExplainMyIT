/**
 * Product Positioning Component
 * 
 * Simple statement of purpose - why this product exists.
 * Re-centers positioning without marketing language.
 * 
 * Purpose: Makes the product feel inevitable.
 */

export function ProductPositioning() {
  return (
    <div className="text-center py-8 border-t border-gray-200 print:hidden">
      <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
        <strong>Explain My IT</strong> exists because most IT documentation is written for technicians, not owners.
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Plain-English IT reality reports for business owners.
      </p>
    </div>
  );
}
