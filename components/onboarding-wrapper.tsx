"use client";

import { useSearchParams } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";

export function OnboardingWrapper() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as "client" | "coach" | "gym_owner" | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <OnboardingForm preselectedRole={role} />
      </div>
    </div>
  );
}

