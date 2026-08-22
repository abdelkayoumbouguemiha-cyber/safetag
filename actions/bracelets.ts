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
