export function ThreatFeedSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div data-testid="threat-feed-skeleton" className="grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl border border-border/70 p-4 shadow-soft overflow-hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 rounded-xl skeleton-shimmer" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-40 max-w-full rounded skeleton-shimmer" />
                <div className="mt-2 h-3 w-72 max-w-full rounded skeleton-shimmer opacity-80" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-7 w-28 rounded-full skeleton-shimmer" />
              <div className="h-7 w-20 rounded-full skeleton-shimmer opacity-80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
