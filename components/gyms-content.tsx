import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { GymsFilters } from "@/components/gyms-filters";
import { DemoBanner } from "@/components/demo-banner";
import type { GymProfileWithSpaces } from "@/types/database";

export async function GymsContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let query = supabase
    .from("gym_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filters
  const amenities = searchParams.amenities as string;
  const cctv = searchParams.cctv as string;
  const tokensMin = searchParams.tokens_min as string;
  const tokensMax = searchParams.tokens_max as string;

  if (cctv === "true") {
    query = query.eq("cctv_available", true);
  }

  if (amenities) {
    query = query.contains("amenities", [amenities]);
  }

  const { data: gyms } = await query;

  // Get spaces for each gym to check tokens
  const gymsWithSpaces: GymProfileWithSpaces[] = [];
  for (const gym of gyms || []) {
    const { data: spaces } = await supabase
      .from("gym_spaces")
      .select("tokens_per_hour")
      .eq("gym_id", gym.id);
    
    const minTokens = spaces?.reduce((min, s) => 
      s.tokens_per_hour < min ? s.tokens_per_hour : min, 
      spaces[0]?.tokens_per_hour || 0
    ) || 0;
    const maxTokens = spaces?.reduce((max, s) => 
      s.tokens_per_hour > max ? s.tokens_per_hour : max, 
      0
    ) || 0;

    // Filter by tokens if provided
    if (tokensMin && maxTokens < parseInt(tokensMin)) continue;
    if (tokensMax && minTokens > parseInt(tokensMax)) continue;

    gymsWithSpaces.push({ ...gym, spaces: spaces || [] });
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {!user && <DemoBanner />}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Gym Spaces for Hourly Booking</h1>
        <p className="text-muted-foreground mt-2">
          Find gym spaces available for hourly booking across the UK. Perfect for personal trainers who need
          flexible access to quality training facilities. Browse by location, equipment type, and amenities.
          Book spaces by the hour for your client sessions without long-term contracts.
        </p>
      </div>

      <GymsFilters />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {gymsWithSpaces.length > 0 ? (
          gymsWithSpaces.map((gym) => (
            <Card key={gym.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{gym.name}</CardTitle>
                    <CardDescription>
                      {gym.address || "No address"}
                    </CardDescription>
                  </div>
                  {gym.cctv_available && (
                    <Badge variant="default">CCTV</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {gym.bio || "No description available"}
                </p>
                {gym.amenities && gym.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gym.amenities.slice(0, 3).map((amenity: string) => (
                      <Badge key={amenity} variant="outline" className="capitalize">
                        {amenity.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {gym.spaces.length} space{gym.spaces.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/gyms/${gym.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No gyms found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

