"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function RequestGymBookingForm({ spaceId }: { spaceId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("gym_booking_requests")
        .insert({
          space_id: spaceId,
          trainer_user_id: user.id,
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          status: "requested",
        });

      if (insertError) throw insertError;

      router.push("/dashboard/coach");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn === null) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Sign in to request a booking for this space.
        </p>
        <Button asChild size="sm" className="w-full">
          <Link href="/auth/login">Sign in to Request</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) =>
              setFormData({ ...formData, start_time: e.target.value })
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
      <Button type="submit" disabled={isLoading} size="sm" className="w-full">
        {isLoading ? "Requesting..." : "Request Booking"}
      </Button>
    </form>
  );
}

