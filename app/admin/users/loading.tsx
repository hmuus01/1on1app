import { Skeleton, SkeletonTableRow } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
        </div>
      </div>
    </div>
  );
}
