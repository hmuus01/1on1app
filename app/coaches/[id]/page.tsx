import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestSessionForm } from "@/components/request-session-form";
import { getUserProfile } from "@/lib/actions/user";
import type { AvailabilityRule } from "@/types/database";

export default async function CoachDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const userProfile = await getUserProfile();

  // Fetch coach profile with user info
  const { data: coachProfile } = await supabase
    .from("coach_profiles")
    .select(`
      *,
      user:user_id (
        id,
        full_name,
        email,
        postcode,
        location_text
      )
    `)
    .eq("user_id", params.id)
    .single();

  if (!coachProfile) {
    notFound();
  }

  // Fetch availability rules
  const { data: availabilityRules } = await supabase
    .from("availability_rules")
    .select("*")
    .eq("owner_type", "coach")
    .eq("owner_id", coachProfile.id)
    .eq("recurring", true)
    .order("day_of_week");

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">
              {coachProfile.user?.full_name || "Coach"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {coachProfile.user?.email}
            </p>
          </div>
          {coachProfile.verification_status === "verified" && (
            <Badge variant="default">Verified</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {coachProfile.bio || "No bio available"}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {coachProfile.experience_years && (
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-muted-foreground">
                    {coachProfile.experience_years} years
                  </p>
                </div>
              )}
              {coachProfile.tokens_per_hour && (
                <div>
                  <p className="text-sm font-medium">Rate</p>
                  <p className="text-muted-foreground">
                    {coachProfile.tokens_per_hour} tokens/hour
                  </p>
                </div>
              )}
              {coachProfile.travel_radius_miles && (
                <div>
                  <p className="text-sm font-medium">Travel Radius</p>
                  <p className="text-muted-foreground">
                    {coachProfile.travel_radius_miles} miles
                  </p>
                </div>
              )}
              {coachProfile.user?.postcode && (
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-muted-foreground">
                    {coachProfile.user.postcode}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {coachProfile.specialties && coachProfile.specialties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {coachProfile.specialties.map((spec: string) => (
                  <Badge key={spec} variant="outline" className="capitalize">
                    {spec.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {coachProfile.qualifications && coachProfile.qualifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {coachProfile.qualifications.map((qual: string, idx: number) => (
                  <li key={idx} className="text-muted-foreground">{qual}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {availabilityRules && availabilityRules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availabilityRules.map((rule: AvailabilityRule) => (
                  <div key={rule.id} className="flex items-center justify-between">
                    <span className="font-medium">
                      {days[rule.day_of_week]}
                    </span>
                    <span className="text-muted-foreground">
                      {rule.start_time} - {rule.end_time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {userProfile?.role === "client" && (
          <Card>
            <CardHeader>
              <CardTitle>Request a Session</CardTitle>
              <CardDescription>
                Send a request to book a 1-to-1 session with this coach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestSessionForm coachUserId={params.id} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

