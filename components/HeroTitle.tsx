"use client";

import { useAgent } from "@/lib/useAgent";
import styles from "./HeroTitle.module.css";

export default function HeroTitle() {
  const snap = useAgent();
  return (
    <h1 className={styles.title}>
      <span>I design where</span>
      <span>
        AI is the <span className={`${styles.accent} accent-text`}>{snap.heroVerb}</span>
      </span>
      <span>material —</span>
      <span>
        and the <span className={`${styles.accent} accent-text`}>interface</span> proves it.
      </span>
    </h1>
  );
}
