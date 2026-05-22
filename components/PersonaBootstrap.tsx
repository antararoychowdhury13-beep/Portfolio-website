"use client";

import { useEffect } from "react";
import { getAgent } from "@/lib/agent";
import { detectPersona } from "@/lib/personas";

export default function PersonaBootstrap() {
  useEffect(() => {
    const agent = getAgent();
    agent.init();
    const id = detectPersona({
      referrer: typeof document !== "undefined" ? document.referrer : "",
      search: typeof window !== "undefined" ? window.location.search : "",
    });
    if (id !== "unknown") {
      // Slight delay so the visitor sees the rail before it fires
      const t = setTimeout(() => agent.runPersona(id, { fromReferrer: true }), 900);
      return () => clearTimeout(t);
    }
  }, []);
  return null;
}
