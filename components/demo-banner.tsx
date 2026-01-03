"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <p className="text-sm">
          <strong>Demo Mode:</strong> You're browsing in demo mode.{" "}
          <Link href="/auth/sign-up" className="underline font-medium">
            Sign up
          </Link>{" "}
          to request sessions and bookings.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 hover:opacity-70"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

