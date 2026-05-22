import styles from "./StatStrip.module.css";

interface Stat {
  value: string;
  label: string;
}

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <ul className={styles.strip}>
      {stats.map((s, i) => (
        <li key={i} className={styles.stat}>
          <div className={styles.value}>
            <span className="serif-italic">{s.value}</span>
          </div>
          <div className={styles.label}>{s.label}</div>
        </li>
      ))}
    </ul>
  );
}
