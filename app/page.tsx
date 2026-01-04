import { Suspense } from "react";
import { HomeContent } from "@/components/home-content";

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-12">
          <div className="text-center space-y-4 max-w-3xl">
            <div className="h-16 w-full bg-muted animate-pulse rounded" />
            <div className="h-6 w-3/4 mx-auto bg-muted animate-pulse rounded" />
          </div>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
