"use client";

import { useState } from "react";
import { useAgent } from "@/lib/useAgent";
import { WHY_BLURB } from "@/lib/intent";
import styles from "./WhyAmISeeingThis.module.css";

export default function WhyAmISeeingThis() {
  const snap = useAgent();
  const [open, setOpen] = useState(false);

  if (snap.persona === "unknown" || snap.surfacedSet.size === 0) return null;

  const blurb = WHY_BLURB[snap.persona] ?? WHY_BLURB.unknown;

  return (
    <span className={styles.wrap}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="why-tooltip"
      >
        why am I seeing this?
      </button>
      {open && (
        <span id="why-tooltip" role="tooltip" className={styles.tooltip}>
          {blurb}
        </span>
      )}
    </span>
  );
}
