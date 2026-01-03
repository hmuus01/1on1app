import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions/user";
import { OnboardingForm } from "@/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <OnboardingForm preselectedRole={searchParams.role as "client" | "coach" | "gym_owner" | undefined} />
      </div>
    </div>
  );
}

