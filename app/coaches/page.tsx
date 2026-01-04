import { Suspense } from "react";
import { CoachesContent } from "@/components/coaches-content";

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="h-10 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    }>
      <CoachesContent searchParams={params} />
    </Suspense>
  );
}
