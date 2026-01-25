"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function RequestSessionForm({ coachUserId }: { coachUserId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    date_time_preferred: "",
    duration_mins: "60",
    location_type: "remote" as "in_gym" | "remote" | "outdoor",
    notes: "",
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
        .from("coach_session_requests")
        .insert({
          coach_user_id: coachUserId,
          client_user_id: user.id,
          date_time_preferred: formData.date_time_preferred
            ? new Date(formData.date_time_preferred).toISOString()
            : null,
          duration_mins: parseInt(formData.duration_mins),
          location_type: formData.location_type,
          notes: formData.notes || null,
          status: "requested",
        });

      if (insertError) throw insertError;

      router.push("/dashboard/client");
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
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Sign in to request a session with this coach.
        </p>
        <Button asChild className="w-full">
          <Link href="/auth/login">Sign in to Request</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="date_time">Preferred Date & Time</Label>
        <Input
          id="date_time"
          type="datetime-local"
          value={formData.date_time_preferred}
          onChange={(e) =>
            setFormData({ ...formData, date_time_preferred: e.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min="30"
          step="30"
          value={formData.duration_mins}
          onChange={(e) =>
            setFormData({ ...formData, duration_mins: e.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location_type">Location Type</Label>
        <select
          id="location_type"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          value={formData.location_type}
          onChange={(e) =>
            setFormData({
              ...formData,
              location_type: e.target.value as "in_gym" | "remote" | "outdoor",
            })
          }
        >
          <option value="remote">Remote</option>
          <option value="in_gym">In Gym</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional information..."
        />
      </div>
      {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Sending Request..." : "Request Session"}
      </Button>
    </form>
  );
}

