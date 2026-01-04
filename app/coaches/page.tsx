import { Suspense } from "react";
import { CoachesContent } from "@/components/coaches-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Personal Trainers in the UK - Qualified Coaches on 1on1",
  description: "Browse verified personal trainers across the UK. Filter by specialty (boxing, strength training, weight loss), location, and availability. Book 1-to-1 sessions with qualified coaches.",
  alternates: {
    canonical: "https://1on1.fitness/coaches",
  },
  openGraph: {
    title: "Find Personal Trainers in the UK - Qualified Coaches on 1on1",
    description: "Browse verified personal trainers across the UK. Filter by specialty, location, and availability.",
    type: "website",
    locale: "en_GB",
  },
};

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
