"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Verify that the current user is an admin
 * Returns the user profile if admin, otherwise redirects or throws
 */
export async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, role, disabled")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    redirect("/auth/login");
  }

  if (profile.disabled) {
    redirect("/auth/login");
  }

  if (profile.role !== "admin") {
    redirect("/dashboard/" + (profile.role || "client"));
  }

  return profile;
}

/**
 * Check if user is admin (for API routes that return JSON)
 * Returns null if not admin, profile if admin
 */
export async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role, disabled")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.disabled || profile.role !== "admin") {
    return null;
  }

  return profile;
}

