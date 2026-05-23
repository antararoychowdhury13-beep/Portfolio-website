"use client";

import { useEffect } from "react";
import { getAgent } from "@/lib/agent";
import { detectPersona } from "@/lib/personas";

export default function PersonaBootstrap() {
  useEffect(() => {
    const agent = getAgent();
    agent.init();

    const search = typeof window !== "undefined" ? window.location.search : "";
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const params = new URLSearchParams(search);
    const explicit = params.get("persona");

    // Rule 1 — `?persona=...` is an explicit override that bypasses the
    // intent moment entirely (useful for direct shareable links).
    if (explicit) {
      const id = detectPersona({ referrer, search });
      const t = setTimeout(() => agent.runPersona(id, { fromReferrer: true }), 600);
      return () => clearTimeout(t);
    }

    // Rule 2 — Otherwise, referrer detection becomes a *hint* that
    // pre-highlights an intent button. The morph fires only when the
    // visitor taps. This is the "calm, never silent" choreography.
    const id = detectPersona({ referrer, search });
    if (id !== "unknown") {
      agent.setReferrerHint(id);
    }
  }, []);
  return null;
}
