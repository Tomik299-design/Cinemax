export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Hero skeleton */}
        <div className="h-[50vh] skeleton rounded-card" />

        {/* Carousel skeletons */}
        {Array.from({ length: 2 }).map((_, row) => (
          <div key={row} className="space-y-4">
            <div className="h-6 w-40 skeleton rounded" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[160px] flex-shrink-0 space-y-2">
                  <div className="aspect-[2/3] skeleton rounded-card" />
                  <div className="h-3 skeleton rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
