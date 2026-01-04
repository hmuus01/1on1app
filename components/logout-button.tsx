"use client";

import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Refresh to update server components (navigation)
    router.refresh();
    router.push("/");
  };

  return <Button onClick={logout}>Logout</Button>;
}
