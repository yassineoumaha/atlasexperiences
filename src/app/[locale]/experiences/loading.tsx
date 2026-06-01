export default function ExperiencesLoading() {
  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        {/* Filter bar */}
        <div className="flex gap-3 mb-8">
          <div className="h-10 w-32 bg-stone-200 rounded-xl" />
          <div className="h-10 w-32 bg-stone-200 rounded-xl" />
          <div className="h-10 w-24 bg-stone-200 rounded-xl" />
        </div>
        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="h-56 bg-stone-200" />
              <div className="p-3 bg-white">
                <div className="h-4 w-3/4 bg-stone-100 rounded mb-2" />
                <div className="h-3 w-1/2 bg-stone-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
