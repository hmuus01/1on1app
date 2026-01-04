import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const adminProfile = await checkAdmin();
    if (!adminProfile) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { disabled, disabled_reason } = body;

    // Prevent disabling own account
    if (id === adminProfile.id && disabled === true) {
      return NextResponse.json(
        { error: "Cannot disable your own account" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const updateData: { disabled: boolean; disabled_reason?: string | null } = {
      disabled: disabled === true,
    };

    if (disabled_reason !== undefined) {
      updateData.disabled_reason = disabled_reason || null;
    }

    const { data, error } = await adminClient
      .from("user_profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user disabled status:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Admin disable error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

