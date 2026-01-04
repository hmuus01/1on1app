import { Suspense } from "react";
import { OnboardingServer } from "./OnboardingServer";

interface OnboardingPageProps {
  searchParams?: { role?: string };
}

export default function OnboardingPage({ searchParams }: OnboardingPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div className="h-96 bg-muted animate-pulse rounded" />
          </div>
        </div>
      }
    >
      <OnboardingServer searchParams={searchParams} />
    </Suspense>
  );
}

