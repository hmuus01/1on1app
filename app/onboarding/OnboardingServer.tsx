import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/actions/user";
import { OnboardingForm } from "@/components/onboarding-form";

interface OnboardingServerProps {
  searchParams?: { role?: string };
}

export async function OnboardingServer({ searchParams }: OnboardingServerProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Must be logged in to access onboarding
  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getUserProfile();

  // If user already has a role, redirect to appropriate dashboard
  if (profile?.role) {
    if (profile.role === "client") {
      redirect("/dashboard/client");
    } else if (profile.role === "coach") {
      redirect("/dashboard/coach");
    } else if (profile.role === "gym_owner") {
      redirect("/dashboard/gym-owner");
    } else if (profile.role === "admin") {
      redirect("/admin");
    }
  }

  const preselectedRole = searchParams?.role as "client" | "coach" | "gym_owner" | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <OnboardingForm preselectedRole={preselectedRole} />
      </div>
    </div>
  );
}

