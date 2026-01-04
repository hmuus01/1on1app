import { Suspense } from "react";
import { AccountServer } from "./AccountServer";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 max-w-2xl">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      }
    >
      <AccountServer />
    </Suspense>
  );
}

