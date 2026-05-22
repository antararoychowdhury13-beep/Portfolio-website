import styles from "./CapabilityMatrix.module.css";

const ROWS = [
  { label: "AI-native product design", score: 9 },
  { label: "Design systems at scale", score: 10 },
  { label: "Enterprise platform UX", score: 10 },
  { label: "Consumer interaction", score: 8 },
  { label: "Spatial / embodied UI", score: 7 },
  { label: "Design leadership", score: 9 },
];

export default function CapabilityMatrix() {
  return (
    <div className={styles.matrix}>
      {ROWS.map((row) => (
        <div key={row.label} className={styles.row}>
          <div className={styles.label}>{row.label}</div>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{ width: `${row.score * 10}%` }}
            />
          </div>
          <div className={styles.score}>
            <span className="serif-italic">{row.score}</span>
            <span className={styles.den}>/10</span>
          </div>
        </div>
      ))}
    </div>
  );
}
