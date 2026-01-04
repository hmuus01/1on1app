import { Suspense } from "react";
import { GymOwnerDashboardServer } from "./GymOwnerDashboardServer";

export default function GymOwnerDashboard() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      }
    >
      <GymOwnerDashboardServer />
    </Suspense>
  );
}

