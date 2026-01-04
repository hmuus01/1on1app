import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/admin-auth";
import { AdminUsersTable } from "@/components/admin-users-table";

export default async function AdminUsersPage() {
  // Verify admin access (redirects if not admin)
  await verifyAdmin();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all users, roles, and account status
        </p>
      </div>

      <AdminUsersTable />
    </div>
  );
}

