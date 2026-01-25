import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/actions/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CoachSessionRequestWithCoach } from "@/types/database";

export async function ClientDashboardServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getUserProfile();
  
  if (!profile) {
    redirect("/onboarding");
  }

  if (!profile.role) {
    redirect("/onboarding");
  }

  if (profile.role !== "client") {
    redirect(`/dashboard/${profile.role.replace('_', '-')}`);
  }
  
  // Fetch session requests
  const { data: sessionRequests } = await supabase
    .from("coach_session_requests")
    .select(`
      *,
      coach:coach_user_id (
        id,
        full_name,
        email
      )
    `)
    .eq("client_user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your training sessions and requests
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Session Requests</CardTitle>
                <CardDescription>
                  Track your requests for 1-to-1 sessions with coaches
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/coaches">Find a Coach</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sessionRequests && sessionRequests.length > 0 ? (
              <div className="space-y-4">
                {sessionRequests.map((request: CoachSessionRequestWithCoach) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {request.coach?.full_name || "Coach"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.date_time_preferred
                          ? new Date(request.date_time_preferred).toLocaleDateString()
                          : "Date TBD"}
                        {" • "}
                        Status: <span className="capitalize">{request.status}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-muted capitalize">
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No session requests yet.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/coaches">Find a Coach</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

