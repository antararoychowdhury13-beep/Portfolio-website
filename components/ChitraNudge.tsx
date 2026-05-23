"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAgent } from "@/lib/useAgent";
import { getAgent } from "@/lib/agent";
import { CASE_TLDR, DWELL_NUDGE, FOOTER_NUDGE, RETURN_NUDGE } from "@/lib/narrator";
import styles from "./ChitraNudge.module.css";

export default function ChitraNudge() {
  const snap = useAgent();
  const router = useRouter();
  const agent = getAgent();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Reset the inline TL;DR whenever a different nudge opens/closes.
  useEffect(() => {
    setExpanded(null);
  }, [snap.nudge.id, snap.nudge.open]);

  if (!snap.nudge.open) return null;

  const { kind, tag, msg, slug } = snap.nudge;
  const close = () => agent.dismissNudge();

  const tldr = slug ? CASE_TLDR[slug] : null;

  return (
    <aside className={styles.nudge} role="status" aria-live="polite">
      <button className={styles.dismiss} aria-label="Dismiss" onClick={close}>
        ×
      </button>
      <div className={styles.head}>
        <span className={styles.orb} aria-hidden />
        <span className={styles.name}>Chitra</span>
        <span className={styles.tag}>{tag}</span>
      </div>

      {expanded ? (
        <>
          <p className={styles.msg}>{expanded}</p>
          <div className={styles.actions}>
            <button className={styles.ghost} onClick={close}>
              Got it
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={styles.msg}>{msg}</p>
          <div className={styles.actions}>
            {kind === "dwell" && tldr && (
              <>
                <button
                  className={styles.primary}
                  onClick={() => setExpanded(tldr.short)}
                >
                  {DWELL_NUDGE.short}
                </button>
                <button
                  className={styles.ghost}
                  onClick={() => setExpanded(tldr.strategic)}
                >
                  {DWELL_NUDGE.strategic}
                </button>
              </>
            )}

            {kind === "footer" && (
              <>
                <button
                  className={styles.primary}
                  onClick={() => {
                    agent.markActed();
                    close();
                    router.push("/contact");
                  }}
                >
                  {FOOTER_NUDGE.primary}
                </button>
                <button className={styles.ghost} onClick={close}>
                  {FOOTER_NUDGE.secondary}
                </button>
              </>
            )}

            {kind === "return" && (
              <>
                <button
                  className={styles.primary}
                  onClick={() => {
                    agent.markActed();
                    close();
                    const end = document.querySelector('[data-narrate="endframe"]');
                    end?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  {RETURN_NUDGE.primary}
                </button>
                <button className={styles.ghost} onClick={close}>
                  {RETURN_NUDGE.secondary}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
