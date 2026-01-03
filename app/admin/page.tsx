import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions/user";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerificationManager } from "@/components/verification-manager";

export default async function AdminPage() {
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

  if (profile.role !== "admin") {
    redirect("/dashboard/" + profile.role);
  }

  const supabase = await createClient();
  
  // Fetch all users
  const { data: users } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch coach profiles with verification status
  const { data: coaches } = await supabase
    .from("coach_profiles")
    .select(`
      *,
      user:user_id (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage users and verifications
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              All registered users ({users?.length || 0})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users && users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user: any) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {user.full_name || "No name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {user.role || "No role"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No users found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coach Verifications</CardTitle>
            <CardDescription>
              Manage coach verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerificationManager coaches={coaches || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

