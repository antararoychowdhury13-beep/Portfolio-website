"use client";

import { useEffect, useRef } from "react";
import { useAgent, formatTimestamp } from "@/lib/useAgent";
import styles from "./AgentStatusRail.module.css";

const STATE_COPY: Record<string, { label: string; cls: string }> = {
  idle: { label: "idle", cls: styles.idle },
  observing: { label: "observing", cls: styles.observing },
  deciding: { label: "deciding", cls: styles.deciding },
  acting: { label: "acting", cls: styles.acting },
};

const KIND_CLASS: Record<string, string> = {
  init: styles.observe,
  observe: styles.observe,
  reason: styles.reason,
  act: styles.act,
  standby: styles.standby,
};

export default function AgentStatusRail() {
  const snap = useAgent();
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [snap.log.length]);

  const stateInfo = STATE_COPY[snap.state];

  return (
    <aside
      className={styles.rail}
      aria-label="Agent status — Chitra"
      role="status"
      aria-live="polite"
    >
      <header className={styles.head}>
        <div className={`${styles.orb} ${stateInfo.cls}`} aria-hidden />
        <div className={styles.title}>
          <div className={styles.name}>
            <span className="serif-italic">Chitra</span>
          </div>
          <div className={styles.meta}>agent · v0.1</div>
        </div>
        <div className={`${styles.pill} ${stateInfo.cls}`}>{stateInfo.label}</div>
      </header>

      <div ref={logRef} className={styles.log}>
        {snap.log.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            <span className={styles.ts}>{formatTimestamp(entry.t)}</span>
            <span className={`${styles.verb} ${KIND_CLASS[entry.kind] ?? ""}`}>
              {entry.kind}
            </span>
            <span className={styles.text}>{entry.text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
