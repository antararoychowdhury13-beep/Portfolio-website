"use client";

import { useEffect, useState } from "react";
import styles from "./CaseStudySpine.module.css";

const LAYERS = [
  { id: "hero", label: "Hero" },
  { id: "middle", label: "Middle" },
  { id: "depth", label: "Depth" },
];

export default function CaseStudySpine() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      let current = "hero";
      for (const l of LAYERS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = l.id;
        }
      }
      setActive(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <aside className={styles.spine} aria-label="Case study progress">
      <div className={styles.label}>case · layers</div>
      <ol className={styles.list}>
        {LAYERS.map((l, i) => (
          <li
            key={l.id}
            className={`${styles.layer} ${active === l.id ? styles.active : ""}`}
          >
            <a href={`#${l.id}`}>
              <span className={styles.dot} aria-hidden />
              <span className={styles.num}>0{i + 1}</span>
              <span className={styles.layerLabel}>{l.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
