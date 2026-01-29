/**
 * Loading State for Report Page
 */

export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Owner Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Top Findings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Block Narratives */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
