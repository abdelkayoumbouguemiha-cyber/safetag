"use server";

import { createClient } from "@/lib/supabase/server";

export async function listBracelets() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, bracelets: [] };
  }

  const { data, error } = await supabase
    .from("children_bracelets")
    .select("id, child_first_name, status, created_at")
    .eq("guardian_id", user.id);

  if (error) {
    return { success: false, bracelets: [] };
  }

  return { success: true, bracelets: data };
}
export async function activateBracelet(code: string, childFirstName: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not logged in." };
  }

  const sanitizedName = childFirstName.trim().slice(0, 50);

  if (!sanitizedName) {
    return { success: false, message: "Please enter a name." };
  }

  const { data, error } = await supabase.rpc("activate_bracelet", {
    bracelet_id: code,
    new_child_name: sanitizedName,
  });

  if (error || !data) {
    return {
      success: false,
      message: "This code is invalid or already activated.",
    };
  }

  return { success: true };
}
export async function deactivateBracelet(braceletId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not logged in." };
  }

  const { data, error } = await supabase.rpc("deactivate_bracelet", {
    bracelet_id: braceletId,
  });

  if (error || !data) {
    return {
      success: false,
      message: "Could not deactivate this bracelet.",
    };
  }

  return { success: true };
}
