import { Skeleton, SkeletonCoachesGrid } from "@/components/ui/skeleton";

export default function GymsLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="mb-8">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
      <SkeletonCoachesGrid />
    </div>
  );
}
