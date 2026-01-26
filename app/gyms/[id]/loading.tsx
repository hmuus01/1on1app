import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function GymDetailLoading() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <div className="grid gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
