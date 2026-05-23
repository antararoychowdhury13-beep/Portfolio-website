import Link from "next/link";
import styles from "./EndFrame.module.css";
import type { CaseSlug } from "@/lib/personas";
import { CASES } from "@/lib/cases";

interface Props {
  proves: string;
  nextSlug?: CaseSlug;
}

export default function EndFrame({ proves, nextSlug }: Props) {
  const next = nextSlug ? CASES[nextSlug] : null;
  return (
    <section className={styles.end} data-narrate="endframe">
      <div className={styles.col}>
        <div className={styles.label}>// what this case proves</div>
        <p className={styles.proves}>{proves}</p>
      </div>

      {next && (
        <div className={styles.col}>
          <div className={styles.label}>// next case</div>
          <Link href={`/work/${next.slug}`} className={styles.next}>
            <span className={styles.nextTag}>{next.tag}</span>
            <span className={styles.nextTitle}>
              {next.title} <em className={styles.arrow}>→</em>
            </span>
          </Link>
        </div>
      )}

      <div className={styles.col}>
        <div className={styles.label}>// talk to me about this</div>
        <Link href="/contact" className={styles.cta}>
          Book a 30-min call →
        </Link>
      </div>
    </section>
  );
}
