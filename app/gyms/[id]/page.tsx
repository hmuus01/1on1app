import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { RequestGymBookingForm } from "@/components/request-gym-booking-form";
import { getUserProfile } from "@/lib/actions/user";
import type { GymSpace, AvailabilityRule } from "@/types/database";

export default async function GymDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const userProfile = await getUserProfile();

  // Fetch gym profile
  const { data: gym } = await supabase
    .from("gym_profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!gym) {
    notFound();
  }

  // Fetch spaces
  const { data: spaces } = await supabase
    .from("gym_spaces")
    .select("*")
    .eq("gym_id", gym.id)
    .order("created_at");

  // Fetch availability rules for spaces
  const spaceIds = spaces?.map(s => s.id) || [];
  const { data: availabilityRules } = spaceIds.length > 0
    ? await supabase
        .from("availability_rules")
        .select("*")
        .eq("owner_type", "gym_space")
        .in("owner_id", spaceIds)
        .eq("recurring", true)
        .order("day_of_week")
    : { data: null };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{gym.name}</h1>
        <p className="text-muted-foreground mt-2">
          {gym.address || "No address"}
          {gym.postcode && `, ${gym.postcode}`}
        </p>
        <div className="flex gap-2 mt-4">
          {gym.cctv_available && (
            <Badge variant="default">CCTV Available</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {gym.bio && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{gym.bio}</p>
            </CardContent>
          </Card>
        )}

        {gym.facilities_text && (
          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{gym.facilities_text}</p>
            </CardContent>
          </Card>
        )}

        {gym.amenities && gym.amenities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {gym.amenities.map((amenity: string) => (
                  <Badge key={amenity} variant="outline" className="capitalize">
                    {amenity.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {gym.rules && (
          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{gym.rules}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Spaces</CardTitle>
            <CardDescription>
              Available spaces for booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {spaces && spaces.length > 0 ? (
              <div className="space-y-4">
                {spaces.map((space: GymSpace) => (
                  <div
                    key={space.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{space.name}</h3>
                        {space.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {space.description}
                          </p>
                        )}
                      </div>
                      {space.tokens_per_hour > 0 && (
                        <Badge variant="outline">
                          {space.tokens_per_hour} tokens/hr
                        </Badge>
                      )}
                    </div>
                    {space.capacity && (
                      <p className="text-sm text-muted-foreground">
                        Capacity: {space.capacity} people
                      </p>
                    )}
                    {space.suitable_for && space.suitable_for.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {space.suitable_for.map((sport: string) => (
                          <Badge key={sport} variant="outline" className="text-xs capitalize">
                            {sport.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {userProfile?.role === "coach" && (
                      <div className="mt-4">
                        <RequestGymBookingForm spaceId={space.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No spaces available yet.
              </p>
            )}
          </CardContent>
        </Card>

        {availabilityRules && availabilityRules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>General Availability</CardTitle>
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
      </div>
    </div>
  );
}

