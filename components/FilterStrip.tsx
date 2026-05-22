"use client";

import { useState } from "react";
import styles from "./FilterStrip.module.css";

interface Props {
  filters: string[];
  active: string;
  onChange: (filter: string) => void;
  renderCount: number;
}

export default function FilterStrip({ filters, active, onChange, renderCount }: Props) {
  return (
    <div className={styles.strip}>
      <span className={styles.label}>filter ·</span>
      <div className={styles.pills}>
        {filters.map((f) => (
          <button
            key={f}
            className={`${styles.pill} ${f === active ? styles.active : ""}`}
            onClick={() => onChange(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <span className={styles.counter}>renders · {renderCount.toString().padStart(2, "0")}</span>
    </div>
  );
}
