import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions/user";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CoachDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getUserProfile();
  
  if (!profile) {
    redirect("/auth/login");
  }

  if (!profile.role) {
    redirect("/onboarding");
  }

  if (profile.role !== "coach") {
    redirect("/dashboard/" + profile.role);
  }

  const supabase = await createClient();
  
  // Fetch coach profile
  const { data: coachProfile } = await supabase
    .from("coach_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .single();

  // Fetch session requests
  const { data: sessionRequests } = await supabase
    .from("coach_session_requests")
    .select(`
      *,
      client:client_user_id (
        id,
        full_name,
        email
      )
    `)
    .eq("coach_user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch gym booking requests
  const { data: gymBookings } = await supabase
    .from("gym_booking_requests")
    .select(`
      *,
      space:space_id (
        id,
        name,
        gym:gym_id (
          id,
          name
        )
      )
    `)
    .eq("trainer_user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Coach Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your sessions and gym bookings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Requests</CardTitle>
            <CardDescription>
              Requests from clients for 1-to-1 sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionRequests && sessionRequests.length > 0 ? (
              <div className="space-y-4">
                {sessionRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {request.client?.full_name || "Client"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.date_time_preferred
                          ? new Date(request.date_time_preferred).toLocaleDateString()
                          : "Date TBD"}
                        {" • "}
                        Status: <span className="capitalize">{request.status}</span>
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded bg-muted capitalize">
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No session requests yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gym Booking Requests</CardTitle>
            <CardDescription>
              Your requests to book gym spaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gymBookings && gymBookings.length > 0 ? (
              <div className="space-y-4">
                {gymBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {booking.space?.gym?.name || "Gym"} - {booking.space?.name || "Space"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date
                          ? new Date(booking.date).toLocaleDateString()
                          : "Date TBD"}
                        {" • "}
                        Status: <span className="capitalize">{booking.status}</span>
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded bg-muted capitalize">
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No gym booking requests yet.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/gyms">Browse Gyms</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

