export default function PortalLoading() {
  return (
    <div className="pt-20 min-h-screen bg-muted/40">
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="h-7 w-48 bg-stone-200 rounded-lg mb-2" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-stone-200 rounded-xl" />
            <div className="h-9 w-24 bg-stone-200 rounded-xl" />
          </div>
        </div>
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4">
              <div className="h-5 w-5 bg-stone-200 rounded mb-2" />
              <div className="h-8 w-12 bg-stone-200 rounded-lg mb-1" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>
        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="h-14 bg-stone-200 rounded-2xl" />
          <div className="h-14 bg-stone-200 rounded-2xl" />
        </div>
        {/* Table skeleton */}
        <div className="h-6 w-32 bg-stone-200 rounded mb-4" />
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-b border-stone-50">
              <div className="h-4 flex-1 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
