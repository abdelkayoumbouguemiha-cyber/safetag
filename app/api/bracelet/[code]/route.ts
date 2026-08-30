import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { braceletCodeSchema } from "@/lib/validation/bracelet";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Step 1: validate the code format before touching the database
  const parsed = braceletCodeSchema.safeParse(code);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: "Missing or invalid code." },
      { status: 400 }
    );
  }

  // Use the admin client here — this endpoint needs to distinguish
  // "not found" vs "unactivated" vs "inactive" internally, which
  // requires seeing rows that the public RLS policy alone wouldn't
  // return. The response itself stays minimal regardless.
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("children_bracelets")
    .select("child_first_name, status")
    .eq("id", code)
    .single();

  // Deliberately generic: whether the code truly doesn't exist,
  // or exists but is unactivated, we return the same 404 —
  // this prevents leaking which codes are "real."
  if (error || !data || data.status === "unactivated") {
    return NextResponse.json(
      { error: "not_found", message: "This code is not recognized." },
      { status: 404 }
    );
  }

  if (data.status === "inactive") {
    return NextResponse.json(
      { error: "inactive", message: "This bracelet is no longer active." },
      { status: 410 }
    );
  }

  return NextResponse.json({
    child_first_name: data.child_first_name,
    bracelet_status: data.status,
  });
}
