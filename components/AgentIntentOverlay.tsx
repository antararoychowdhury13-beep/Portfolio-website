"use client";

import { useAgent } from "@/lib/useAgent";
import { getAgent } from "@/lib/agent";
import styles from "./AgentIntentOverlay.module.css";

export default function AgentIntentOverlay() {
  const snap = useAgent();
  const agent = getAgent();

  if (!snap.overlay.open) return null;

  return (
    <div className={styles.wrap} role="dialog" aria-label="Agent recommendation">
      <header className={styles.head}>
        <div className={styles.orb} aria-hidden />
        <div className={styles.label}>
          <span className={styles.tag}>{snap.overlay.ctx}</span>
          <span className={styles.kicker}>Chitra · recommendation</span>
        </div>
        <button
          className={styles.dismiss}
          aria-label="Dismiss"
          onClick={() => agent.dismissOverlay()}
        >
          ×
        </button>
      </header>

      <p className={styles.msg}>{snap.overlay.msg}</p>

      <div className={styles.actions}>
        <button
          className={styles.primary}
          onClick={() => {
            agent.openCalendar();
          }}
        >
          {snap.overlay.primary}
        </button>
        <button
          className={styles.secondary}
          onClick={() => agent.dismissOverlay()}
        >
          {snap.overlay.secondary}
        </button>
      </div>
    </div>
  );
}
