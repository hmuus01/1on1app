import { Suspense } from "react";
import { ClientDashboardServer } from "./ClientDashboardServer";

export default function ClientDashboard() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      }
    >
      <ClientDashboardServer />
    </Suspense>
  );
}

