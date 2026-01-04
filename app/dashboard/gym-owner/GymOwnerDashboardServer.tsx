import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/actions/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function GymOwnerDashboardServer() {
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

  if (profile.role !== "gym_owner") {
    redirect(`/dashboard/${profile.role.replace('_', '-')}`);
  }
  
  // Fetch gyms owned by this user
  const { data: gyms } = await supabase
    .from("gym_profiles")
    .select("*")
    .eq("owner_user_id", profile.id)
    .order("created_at", { ascending: false });

  // Fetch booking requests for all spaces in owned gyms
  let allBookingRequests: any[] = [];
  const gymIds = gyms?.map(g => g.id) || [];
  
  if (gymIds.length > 0) {
    const { data: spaces } = await supabase
      .from("gym_spaces")
      .select("id")
      .in("gym_id", gymIds);
    
    const spaceIds = spaces?.map(s => s.id) || [];
    if (spaceIds.length > 0) {
      const { data: requests } = await supabase
        .from("gym_booking_requests")
        .select(`
          *,
          space:space_id (
            id,
            name,
            gym_id
          ),
          trainer:trainer_user_id (
            id,
            full_name,
            email
          )
        `)
        .in("space_id", spaceIds)
        .order("created_at", { ascending: false })
        .limit(20);
      allBookingRequests = requests || [];
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gym Owner Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your gyms, spaces, and booking requests
          </p>
        </div>
        <Button asChild>
          <Link href="/gyms/new">Add New Gym</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Gyms</CardTitle>
            <CardDescription>
              Manage your listed gyms and spaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gyms && gyms.length > 0 ? (
              <div className="space-y-4">
                {gyms.map((gym) => (
                  <div
                    key={gym.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{gym.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {gym.address || "No address"}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/gyms/${gym.id}`}>Manage</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No gyms listed yet.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/gyms/new">Add Your First Gym</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
            <CardDescription>
              Requests from coaches to book your spaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allBookingRequests.length > 0 ? (
              <div className="space-y-4">
                {allBookingRequests.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {booking.trainer?.full_name || "Trainer"} - {booking.space?.name || "Space"}
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
              <p className="text-center py-8 text-muted-foreground">
                No booking requests yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

