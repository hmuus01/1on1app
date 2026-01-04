"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    // Check for schema cache error
    if (error.message?.includes("schema cache") || error.message?.includes("not found") || error.code === "PGRST301") {
      console.error("Schema cache error - run: NOTIFY pgrst, 'reload schema';");
      throw new Error("Schema cache error. Please run 'NOTIFY pgrst, 'reload schema';' in Supabase SQL Editor.");
    }
    // Only log unexpected errors
    console.error("Unexpected error fetching user profile:", error.message || error);
    return null;
  }

  // If profile doesn't exist, bootstrap it with upsert
  if (!data) {
    const { data: newProfile, error: upsertError } = await supabase
      .from("user_profiles")
      .upsert({
        id: user.id,
        email: user.email,
        role: null,
        disabled: false,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })
      .select()
      .maybeSingle();

    if (upsertError) {
      // Silent fail on upsert - trigger should have created it
      console.warn("Could not bootstrap profile, but trigger may have created it:", upsertError.message);
      // Try fetching again
      const { data: refetchedProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return refetchedProfile;
    }

    return newProfile;
  }

  return data;
}

export async function updateUserProfile(data: {
  full_name?: string;
  phone?: string;
  location_text?: string;
  postcode?: string;
  profile_photo_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("user_profiles")
    .update(data)
    .eq("id", user.id);

  if (error) {
    // Check for schema cache error
    if (error.message?.includes("schema cache") || error.message?.includes("not found") || error.code === "PGRST301") {
      return { 
        success: false, 
        error: "Schema cache error. Please run 'NOTIFY pgrst, 'reload schema';' in Supabase SQL Editor and try again." 
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateUserRole(role: "client" | "coach" | "gym_owner" | "admin") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({ role })
    .eq("id", user.id);

  if (error) {
    // Check for schema cache error
    if (error.message?.includes("schema cache") || error.message?.includes("not found") || error.code === "PGRST301") {
      return { 
        success: false, 
        error: "Schema cache error. Please run 'NOTIFY pgrst, 'reload schema';' in Supabase SQL Editor and try again." 
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createCoachProfile(data: {
  bio?: string;
  specialties?: string[];
  experience_years?: number;
  qualifications?: string[];
  tokens_per_hour?: number;
  travel_radius_miles?: number;
  languages?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    // Check for schema cache error
    if (profileError.message?.includes("schema cache") || profileError.message?.includes("not found") || profileError.code === "PGRST301") {
      return { 
        success: false, 
        error: "Schema cache error. Please run 'NOTIFY pgrst, 'reload schema';' in Supabase SQL Editor and try again." 
      };
    }
    return { success: false, error: profileError.message || "Failed to fetch profile" };
  }

  if (!profile) {
    return { success: false, error: "User profile not found. Please complete onboarding first." };
  }

  if (profile.role !== "coach") {
    return { success: false, error: "User is not a coach" };
  }

  const { error } = await supabase
    .from("coach_profiles")
    .insert({
      user_id: user.id,
      ...data,
    });

  if (error) {
    // Check for schema cache error
    if (error.message?.includes("schema cache") || error.message?.includes("not found") || error.code === "PGRST301") {
      return { 
        success: false, 
        error: "Schema cache error. Please run 'NOTIFY pgrst, 'reload schema';' in Supabase SQL Editor and try again." 
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createGymProfile(data: {
  name: string;
  address?: string;
  postcode?: string;
  bio?: string;
  facilities_text?: string;
  amenities?: string[];
  cctv_available?: boolean;
  rules?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    // Check for schema cache error
    if (profileError.message?.includes("schema cache") || profileError.message?.includes("not found") || profileError.code === "PGRST301") {
      return { 
        success: false, 
        error: "Schema cache error. Please run 'NOTIFY pgrst, 'reload schema';' in Supabase SQL Editor and try again." 
      };
    }
    return { success: false, error: profileError.message || "Failed to fetch profile" };
  }

  if (!profile) {
    return { success: false, error: "User profile not found. Please complete onboarding first." };
  }

  if (profile.role !== "gym_owner") {
    return { success: false, error: "User is not a gym owner" };
  }

  const { error } = await supabase
    .from("gym_profiles")
    .insert({
      owner_user_id: user.id,
      ...data,
    });

  if (error) {
    // Check for schema cache error
    if (error.message?.includes("schema cache") || error.message?.includes("not found") || error.code === "PGRST301") {
      return { 
        success: false, 
        error: "Schema cache error. Please run 'NOTIFY pgrst, 'reload schema';' in Supabase SQL Editor and try again." 
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

