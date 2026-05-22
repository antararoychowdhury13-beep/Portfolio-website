import styles from "./PullQuote.module.css";

export default function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className={styles.q}>
      <span className={styles.mark} aria-hidden>"</span>
      <p>{children}</p>
      <span className={`${styles.mark} ${styles.markRight}`} aria-hidden>"</span>
    </blockquote>
  );
}
