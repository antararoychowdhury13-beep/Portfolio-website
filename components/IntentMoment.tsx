"use client";

import { useMemo } from "react";
import { getAgent } from "@/lib/agent";
import { useAgent } from "@/lib/useAgent";
import { INTENT_LABELS, type IntentToken } from "@/lib/intent";
import styles from "./IntentMoment.module.css";

const PRIMARY_INTENTS: IntentToken[] = ["role", "problem", "curiosity"];

function preselectFromHint(
  hint: ReturnType<typeof useAgent>["referrerHint"],
): IntentToken | null {
  switch (hint) {
    case "recruiter-ai-lab":
    case "enterprise-hiring":
      return "role";
    case "founder":
      return "problem";
    case "peer-designer":
      return "curiosity";
    default:
      return null;
  }
}

export default function IntentMoment() {
  const snap = useAgent();
  const agent = getAgent();

  const preselect = useMemo(
    () => preselectFromHint(snap.referrerHint),
    [snap.referrerHint],
  );

  if (snap.intentTaken) return null;

  const handleTap = (intent: IntentToken) => {
    void agent.setIntent(intent);
  };

  return (
    <section
      className={styles.wrap}
      aria-label="Tell the portfolio what brought you here"
    >
      <div className={styles.kicker}>
        <span className={styles.ping} aria-hidden />
        <span>one question · then the portfolio adapts</span>
      </div>

      <h2 className={styles.question}>
        What brought you <em>here</em> today?
      </h2>

      <div className={styles.options} role="group" aria-label="Intent">
        {PRIMARY_INTENTS.map((intent) => {
          const meta = INTENT_LABELS[intent];
          const isHinted = preselect === intent;
          return (
            <button
              key={intent}
              type="button"
              className={`${styles.option} ${isHinted ? styles.hinted : ""}`}
              onClick={() => handleTap(intent)}
              aria-pressed={isHinted}
            >
              <span className={styles.optionLabel}>{meta.label}</span>
              <span className={styles.optionSub}>{meta.sub}</span>
              {isHinted && (
                <span className={styles.hintTag} aria-hidden>
                  suggested
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.skip}
        onClick={() => handleTap("skip")}
      >
        {INTENT_LABELS.skip.label}
      </button>
    </section>
  );
}
