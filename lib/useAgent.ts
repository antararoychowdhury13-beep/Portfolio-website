"use client";

import { useEffect, useState } from "react";
import { getAgent, type AgentSnapshot } from "./agent";

export function useAgent(): AgentSnapshot {
  const [snap, setSnap] = useState<AgentSnapshot>(() => getAgent().snapshot());

  useEffect(() => {
    const unsub = getAgent().subscribe(setSnap);
    return unsub;
  }, []);

  return snap;
}

export function formatTimestamp(t: number): string {
  const totalSeconds = Math.floor(t / 1000);
  const mm = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}
