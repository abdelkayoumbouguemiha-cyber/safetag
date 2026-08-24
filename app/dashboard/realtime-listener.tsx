"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RealtimeListener({ guardianId }: { guardianId: string }) {
  const router = useRouter();
  const instanceId = useRef(Math.random().toString(36).slice(2));

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    async function setup() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (session) {
        supabase.realtime.setAuth(session.access_token);
      }

      channel = supabase
        .channel(`scan-updates-${guardianId}-${instanceId.current}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "scan_logs" },
          () => {
            router.refresh();
          }
        )
        .subscribe();
    }

    setup();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [guardianId, router]);

  return null;
}
