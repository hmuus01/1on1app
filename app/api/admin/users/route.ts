import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminProfile = await checkAdmin();
    if (!adminProfile) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const disabled = searchParams.get("disabled");

    const adminClient = createAdminClient();

    let query = adminClient
      .from("user_profiles")
      .select("id, email, created_at, role, disabled, disabled_reason")
      .order("created_at", { ascending: false });

    // Apply filters
    if (search) {
      query = query.ilike("email", `%${search}%`);
    }

    if (role) {
      query = query.eq("role", role);
    }

    if (disabled !== null) {
      query = query.eq("disabled", disabled === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ users: data || [] });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

