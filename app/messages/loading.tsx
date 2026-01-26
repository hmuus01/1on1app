import { Skeleton, SkeletonMessageThread } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="p-6">
            <SkeletonMessageThread />
          </div>
        </div>
        <div className="rounded-lg border bg-card">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6">
            <SkeletonMessageThread />
          </div>
        </div>
      </div>
    </div>
  );
}
