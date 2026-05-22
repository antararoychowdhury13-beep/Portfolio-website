import Link from "next/link";
import styles from "./FrameworkCard.module.css";

interface Props {
  tag: string;
  title: string;
  titleAccent: string;
  description: string;
  stages: string[];
  href: string;
}

export default function FrameworkCard({
  tag,
  title,
  titleAccent,
  description,
  stages,
  href,
}: Props) {
  const [pre, post] = title.split(titleAccent);
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.tag}>{tag}</div>
      <h3 className={styles.title}>
        {pre}
        <em>{titleAccent}</em>
        {post}
      </h3>
      <p className={styles.desc}>{description}</p>
      <ol className={styles.stages}>
        {stages.map((s, i) => (
          <li key={s} className={styles.stage}>
            <span className={styles.stageNum}>0{i + 1}</span>
            <span className={styles.stageLabel}>{s}</span>
          </li>
        ))}
      </ol>
      <div className={styles.cta}>Read the framework →</div>
    </Link>
  );
}
