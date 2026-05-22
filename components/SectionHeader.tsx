import styles from "./SectionHeader.module.css";

interface Props {
  label: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  flag?: string;
}

export default function SectionHeader({ label, title, meta, flag }: Props) {
  return (
    <header className={styles.head}>
      <div className={styles.left}>
        <div className={styles.label}>// {label}</div>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.right}>
        {flag && <span className={styles.flag}>↻ {flag}</span>}
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>
    </header>
  );
}
