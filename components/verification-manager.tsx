"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import type { CoachProfileWithUser } from "@/types/database";

export function VerificationManager({ coaches }: { coaches: CoachProfileWithUser[] }) {
  const [updating, setUpdating] = useState<string | null>(null);

  const updateVerification = async (
    coachId: string,
    field: "verification_status" | "background_check_status" | "insurance_status",
    value: string
  ) => {
    setUpdating(coachId);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("coach_profiles")
        .update({ [field]: value })
        .eq("id", coachId);

      if (error) throw error;
      
      // Refresh page
      window.location.reload();
    } catch (err) {
      logger.error("Error updating verification:", err);
      toast.error("Failed to update verification status");
    } finally {
      setUpdating(null);
    }
  };

  if (coaches.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No coaches found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {coaches.map((coach) => (
        <div
          key={coach.id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {coach.user?.full_name || "Coach"}
              </p>
              <p className="text-sm text-muted-foreground">
                {coach.user?.email}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Verification</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {coach.verification_status}
                </Badge>
                <select
                  className="flex h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                  value={coach.verification_status}
                  onChange={(e) =>
                    updateVerification(
                      coach.id,
                      "verification_status",
                      e.target.value
                    )
                  }
                  disabled={updating === coach.id}
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Background Check</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {coach.background_check_status}
                </Badge>
                <select
                  className="flex h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                  value={coach.background_check_status}
                  onChange={(e) =>
                    updateVerification(
                      coach.id,
                      "background_check_status",
                      e.target.value
                    )
                  }
                  disabled={updating === coach.id}
                >
                  <option value="pending">Pending</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Insurance</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {coach.insurance_status}
                </Badge>
                <select
                  className="flex h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                  value={coach.insurance_status}
                  onChange={(e) =>
                    updateVerification(
                      coach.id,
                      "insurance_status",
                      e.target.value
                    )
                  }
                  disabled={updating === coach.id}
                >
                  <option value="pending">Pending</option>
                  <option value="valid">Valid</option>
                  <option value="invalid">Invalid</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

