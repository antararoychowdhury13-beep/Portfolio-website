import styles from "./ArtifactCard.module.css";

interface Props {
  num: string;
  kind: string;
  caption: string;
  children?: React.ReactNode;
}

export default function ArtifactCard({ num, kind, caption, children }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.tag}>
        <span className={styles.kind}>{kind}</span>
        <span className={styles.num}>{num}</span>
      </div>
      <p className={styles.caption}>{caption}</p>
      <div className={styles.visual}>{children}</div>
    </article>
  );
}
