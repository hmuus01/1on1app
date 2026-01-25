import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function DELETE(
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

    // Prevent deleting own account
    if (id === adminProfile.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Delete from user_profiles (cascade will handle related records)
    const { error } = await adminClient
      .from("user_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Error deleting user:", error);
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }

    // Also delete from auth.users using admin client
    const { error: authError } = await adminClient.auth.admin.deleteUser(id);

    if (authError) {
      logger.error("Error deleting auth user:", authError);
      // Continue even if auth deletion fails - profile is already deleted
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Admin delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

