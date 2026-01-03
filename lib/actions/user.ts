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
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
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
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "coach") {
    return { success: false, error: "User is not a coach" };
  }

  const { error } = await supabase
    .from("coach_profiles")
    .insert({
      user_id: user.id,
      ...data,
    });

  if (error) {
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
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "gym_owner") {
    return { success: false, error: "User is not a gym owner" };
  }

  const { error } = await supabase
    .from("gym_profiles")
    .insert({
      owner_user_id: user.id,
      ...data,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

