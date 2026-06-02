export default function DestinationsLoading() {
  return (
    <div className="pt-20 min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-9 w-64 bg-muted rounded-lg mb-2" />
        <div className="h-5 w-80 bg-muted rounded mb-10" />
        {/* Featured hero */}
        <div className="h-64 bg-muted rounded-3xl mb-10" />
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border">
              <div className="h-48 bg-muted" />
              <div className="p-4">
                <div className="h-5 w-1/2 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded mb-1" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
