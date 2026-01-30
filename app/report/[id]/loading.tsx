/**
 * Loading State for Report Page
 */

export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-brand-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="h-8 w-48 bg-brand-navy/10 rounded animate-pulse mb-4" />
          <div className="h-10 w-3/4 bg-brand-navy/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-brand-navy/10 rounded animate-pulse" />
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Owner Summary */}
        <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8 animate-pulse">
          <div className="bg-brand-navy/5 rounded-[12px] p-6">
            <div className="h-8 w-32 bg-brand-navy/15 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-brand-navy/10 rounded" />
              <div className="h-4 w-full bg-brand-navy/10 rounded" />
              <div className="h-4 w-3/4 bg-brand-navy/10 rounded" />
            </div>
          </div>
        </div>

        {/* Top Findings */}
        <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8 animate-pulse">
          <div className="h-8 w-40 bg-brand-navy/15 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-brand-border rounded-[14px] p-5">
                <div className="h-6 w-2/3 bg-brand-navy/10 rounded mb-2" />
                <div className="h-4 w-full bg-brand-navy/10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Block Narratives */}
        <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8 animate-pulse">
          <div className="h-8 w-48 bg-brand-navy/15 rounded mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-brand-border rounded-[14px] p-5">
                <div className="h-6 w-1/2 bg-brand-navy/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
