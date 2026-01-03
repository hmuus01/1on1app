"use server";

import { createClient } from "@/lib/supabase/server";

export async function validateInviteCode(code: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("invites")
    .select("code, assigned_role, assigned_email, used_at")
    .eq("code", code)
    .single();

  if (error || !data) {
    return { valid: false, error: "Invalid invite code" };
  }

  if (data.used_at) {
    return { valid: false, error: "This invite code has already been used" };
  }

  return { 
    valid: true, 
    role: data.assigned_role,
    assignedEmail: data.assigned_email 
  };
}

export async function markInviteUsed(code: string, email: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("invites")
    .update({ used_at: new Date().toISOString() })
    .eq("code", code);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

