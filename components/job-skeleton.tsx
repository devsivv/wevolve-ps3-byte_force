export function JobCardSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted" />
          <div className="flex-1">
            <div className="h-5 w-48 bg-muted rounded mb-2" />
            <div className="h-4 w-32 bg-muted rounded mb-2" />
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 animate-pulse h-80">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-lg bg-muted" />
        <div className="w-14 h-14 rounded-full bg-muted" />
      </div>
      <div className="h-5 w-3/4 bg-muted rounded mb-2" />
      <div className="h-4 w-1/2 bg-muted rounded mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
      <div className="flex gap-2 mt-auto">
        <div className="h-8 flex-1 bg-muted rounded" />
        <div className="h-8 flex-1 bg-muted rounded" />
      </div>
    </div>
  )
}
