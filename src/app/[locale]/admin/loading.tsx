export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-2xl" />
    </div>
  );
}
