"use client";

import { useAgent } from "@/lib/useAgent";
import styles from "./VisitorTag.module.css";

export default function VisitorTag() {
  const snap = useAgent();
  return (
    <div className={styles.tag} aria-live="polite">
      <span className={styles.ping} aria-hidden />
      <span>{snap.contextLabel}</span>
    </div>
  );
}
