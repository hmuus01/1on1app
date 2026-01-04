import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoBanner } from "@/components/demo-banner";
import { createClient } from "@/lib/supabase/server";

export async function HomeContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col">
      {!user && <DemoBanner />}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-12">
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Perfect 1-on-1 Training
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with expert coaches and book gym spaces across the UK. 
            Your fitness journey, personalized.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/coaches">Find a Coach</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={user ? "/dashboard/gym-owner" : "/onboarding?role=gym_owner"}>List Your Gym</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
          <Card>
            <CardHeader>
              <CardTitle>For Clients</CardTitle>
              <CardDescription>
                Find and book 1-to-1 sessions with verified coaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Browse verified coaches</li>
                <li>• Book personalized sessions</li>
                <li>• Track your progress</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Coaches</CardTitle>
              <CardDescription>
                Offer training sessions and book gym spaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Manage your availability</li>
                <li>• Book gym spaces</li>
                <li>• Connect with clients</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Gym Owners</CardTitle>
              <CardDescription>
                List your gym and manage space bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• List your spaces</li>
                <li>• Manage bookings</li>
                <li>• Set availability</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

