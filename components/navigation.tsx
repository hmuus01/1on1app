import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { getUserProfile } from "@/lib/actions/user";
import { createClient } from "@/lib/supabase/server";

export async function Navigation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    profile = await getUserProfile();
  }

  return (
    <nav className="w-full border-b border-b-foreground/10">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg">
            1on1
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/coaches" className="text-sm hover:underline">
              Find a Coach
            </Link>
            <Link href="/gyms" className="text-sm hover:underline">
              Browse Gyms
            </Link>
            {user && profile?.role === "coach" && (
              <Link href="/dashboard/coach" className="text-sm hover:underline">
                Dashboard
              </Link>
            )}
            {user && profile?.role === "client" && (
              <Link href="/dashboard/client" className="text-sm hover:underline">
                Dashboard
              </Link>
            )}
            {user && profile?.role === "gym_owner" && (
              <Link href="/dashboard/gym-owner" className="text-sm hover:underline">
                Dashboard
              </Link>
            )}
            {user && profile?.role === "admin" && (
              <Link href="/admin" className="text-sm hover:underline">
                Admin
              </Link>
            )}
            {user && (
              <Link href="/messages" className="text-sm hover:underline">
                Messages
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

