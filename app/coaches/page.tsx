import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { CoachesFilters } from "@/components/coaches-filters";
import { DemoBanner } from "@/components/demo-banner";

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("coach_profiles")
    .select(`
      *,
      user:user_id (
        id,
        full_name,
        email,
        postcode
      )
    `)
    .order("created_at", { ascending: false });

  // Apply filters
  const specialty = searchParams.specialty as string;
  const tokensMin = searchParams.tokens_min as string;
  const tokensMax = searchParams.tokens_max as string;
  const verified = searchParams.verified as string;
  const postcode = searchParams.postcode as string;

  if (specialty) {
    query = query.contains("specialties", [specialty]);
  }

  if (verified === "true") {
    query = query.eq("verification_status", "verified");
  }

  const { data: coaches } = await query;

  // Filter by tokens if provided
  let filteredCoaches = coaches || [];
  if (tokensMin) {
    filteredCoaches = filteredCoaches.filter(
      (c: any) => c.tokens_per_hour >= parseInt(tokensMin)
    );
  }
  if (tokensMax) {
    filteredCoaches = filteredCoaches.filter(
      (c: any) => c.tokens_per_hour <= parseInt(tokensMax)
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {!user && <DemoBanner />}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find a Coach</h1>
        <p className="text-muted-foreground mt-2">
          Browse verified coaches and book 1-to-1 sessions
        </p>
      </div>

      <CoachesFilters />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredCoaches.length > 0 ? (
          filteredCoaches.map((coach: any) => (
            <Card key={coach.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {coach.user?.full_name || "Coach"}
                    </CardTitle>
                    <CardDescription>
                      {coach.user?.email}
                    </CardDescription>
                  </div>
                  {coach.verification_status === "verified" && (
                    <Badge variant="default">Verified</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {coach.bio || "No bio available"}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specialties?.slice(0, 3).map((spec: string) => (
                    <Badge key={spec} variant="outline" className="capitalize">
                      {spec.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {coach.tokens_per_hour || "N/A"} tokens/hr
                    </p>
                    {coach.experience_years && (
                      <p className="text-xs text-muted-foreground">
                        {coach.experience_years} years experience
                      </p>
                    )}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/coaches/${coach.user_id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No coaches found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

