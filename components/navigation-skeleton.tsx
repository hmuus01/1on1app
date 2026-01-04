export function NavigationSkeleton() {
  return (
    <nav className="w-full border-b border-b-foreground/10">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-6">
          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </nav>
  );
}

