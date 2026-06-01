export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-stone-200 rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 bg-stone-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-stone-200 rounded-2xl" />
    </div>
  );
}
