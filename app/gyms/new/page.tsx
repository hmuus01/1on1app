import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

export default async function NewGymPage() {
  noStore();
  const profile = await getUserProfile();

  // If not logged in, redirect to signup
  if (!profile) {
    redirect("/auth/sign-up");
  }

  // If logged in but not a gym owner, redirect to onboarding
  if (profile.role !== "gym_owner") {
    if (!profile.role) {
      redirect("/onboarding");
    }
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>List Your Gym</CardTitle>
            <CardDescription>
              You need to be a gym owner to list gyms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To list your gym, you need to complete onboarding as a gym owner.
            </p>
            <Button asChild>
              <Link href="/onboarding?role=gym_owner">Go to Onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If already a gym owner, redirect to dashboard
  redirect("/dashboard/gym-owner");
}

