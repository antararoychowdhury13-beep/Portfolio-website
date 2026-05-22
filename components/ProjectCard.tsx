"use client";

import Link from "next/link";
import { useAgent } from "@/lib/useAgent";
import { CASES } from "@/lib/cases";
import type { CaseSlug } from "@/lib/personas";
import styles from "./ProjectCard.module.css";

interface Props {
  slug: CaseSlug;
  visible: boolean;
  orderIndex: number;
}

export default function ProjectCard({ slug, visible, orderIndex }: Props) {
  const snap = useAgent();
  const data = CASES[slug];
  const surfaced = snap.surfacedSet.has(slug);
  const demoted = snap.surfacedSet.size > 0 && !surfaced;

  const className = [
    styles.card,
    surfaced && styles.surfaced,
    demoted && styles.demoted,
    !visible && styles.hidden,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={`/work/${slug}`}
      className={className}
      style={{ order: orderIndex }}
      data-slug={slug}
    >
      <header className={styles.metaRow}>
        <span className={styles.tag}>{data.tag}</span>
        <span className={styles.year}>{data.year}</span>
      </header>

      <h3 className={styles.title}>
        {data.title.split(data.titleAccent)[0]}
        <em>{data.titleAccent}</em>
        {data.title.split(data.titleAccent)[1]}
      </h3>

      <p className={styles.desc}>{data.description}</p>

      <ul className={styles.pills}>
        {data.pills.map((p) => (
          <li key={p} className={styles.pill}>
            {p}
          </li>
        ))}
      </ul>

      {surfaced && (
        <span className={styles.badge} aria-label="Agent-surfaced">
          surfaced · for you
        </span>
      )}
    </Link>
  );
}
