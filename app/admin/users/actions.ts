"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();

  // 1. Authenticate caller
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  // 2. Fetch caller's profile to verify admin status
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  // 3. Safety check: prevent admins from changing their own role
  if (userId === user.id) {
    throw new Error("Forbidden: You cannot change your own role.");
  }

  // 4. Update the target user's role using the admin client to bypass RLS
  const adminClient = await import("@/utils/supabase/admin").then(m => m.createAdminClient());
  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (updateError) {
    console.error("Failed to update user role:", updateError);
    throw new Error("Failed to update user role.");
  }

  // 5. Revalidate the users page
  revalidatePath("/admin/users");
}
