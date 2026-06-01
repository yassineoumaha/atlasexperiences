export default function BlogLoading() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
        <div className="h-9 w-40 bg-stone-200 rounded-lg mb-2" />
        <div className="h-5 w-72 bg-stone-100 rounded mb-10" />
        {/* Featured post */}
        <div className="h-72 bg-stone-200 rounded-3xl mb-12" />
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-stone-100">
              <div className="h-44 bg-stone-200" />
              <div className="p-4">
                <div className="h-3 w-16 bg-stone-200 rounded mb-2" />
                <div className="h-5 w-full bg-stone-200 rounded mb-1" />
                <div className="h-5 w-3/4 bg-stone-200 rounded mb-3" />
                <div className="h-3 w-full bg-stone-100 rounded mb-1" />
                <div className="h-3 w-5/6 bg-stone-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
